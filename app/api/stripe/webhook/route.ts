import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { markDocumentAsPaid, getDocument } from '@/lib/services/storage-service';
import { sendLetterEmail } from '@/lib/services/email-service';
import { logger } from '@/lib/logger';

/**
 * POST /api/stripe/webhook
 * Handle Stripe payment confirmation webhook
 * 
 * Elite Standards:
 * - Webhook signature verification (security!)
 * - Idempotent (can run multiple times safely)
 * - Structured logging
 * - <150 lines
 */
export async function POST(req: NextRequest) {
  try {
    // Get raw body (needed for signature verification)
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      logger.warn('Webhook received without signature');
      return NextResponse.json(
        { error: 'No signature provided' },
        { status: 400 }
      );
    }

    // Verify Stripe signature (CRITICAL for security)
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      logger.error('Stripe webhook secret not configured');
      return NextResponse.json(
        { error: 'Webhook not configured' },
        { status: 500 }
      );
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.warn('Webhook signature verification failed', { error: errorMessage });
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    logger.info('Webhook received', {
      type: event.type,
      id: event.id,
    });

    // Handle checkout completion
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const documentId = session.metadata?.documentId;

      if (!documentId) {
        logger.warn('Webhook missing documentId in metadata', {
          sessionId: session.id,
        });
        // Don't fail - acknowledge receipt but log warning
        return NextResponse.json({ received: true }, { status: 200 });
      }

      // Mark document as paid (server-side - best effort in serverless)
      // Note: In serverless environments, this may not persist across instances
      // Client-side localStorage is the primary source of truth
      const result = markDocumentAsPaid(documentId);

      if (!result.success) {
        logger.error('Failed to mark document as paid (serverless limitation)', {
          documentId,
          sessionId: session.id,
          error: result.error,
          note: 'Client-side localStorage will still work',
        });
        // Don't fail the webhook - acknowledge receipt
        // The editor page will mark as paid based on session_id in URL
        return NextResponse.json({ received: true }, { status: 200 });
      }

      logger.info('Payment confirmed, document unlocked', {
        documentId,
        sessionId: session.id,
        amount: session.amount_total,
        currency: session.currency,
        paymentStatus: session.payment_status,
      });

      // Send email with letter (async, non-blocking)
      // Get email from metadata or Stripe customer email
      const userEmail = session.metadata?.userEmail || session.customer_email || session.customer_details?.email;
      
      if (userEmail && userEmail.trim()) {
        logger.info('Attempting to send letter email', {
          documentId,
          email: userEmail,
        });

        // Try to get document from storage (best effort)
        const docResult = getDocument(documentId);
        
        if (docResult.success && docResult.data) {
          // Extract applicant name from document
          const applicantName = docResult.data.sections?.[0]?.content?.match(/My name is ([^,]+)/)?.[1] || 'Customer';
          
          // Send email (async, don't block webhook response)
          sendLetterEmail({
            to: userEmail,
            documentText: docResult.data.rawText,
            applicantName,
          }).then((emailResult) => {
            if (emailResult.success) {
              logger.info('Letter email sent successfully', {
                documentId,
                email: userEmail,
                emailId: emailResult.data?.emailId,
              });
            } else {
              logger.warn('Failed to send letter email', {
                documentId,
                email: userEmail,
                error: emailResult.error,
              });
            }
          }).catch((error) => {
            logger.error('Email sending error', {
              documentId,
              email: userEmail,
              error: error instanceof Error ? error.message : 'Unknown error',
            });
          });
        } else {
          logger.warn('Could not retrieve document for email', {
            documentId,
            error: 'Document not found in server storage (expected in serverless)',
          });
        }
      } else {
        logger.info('No email provided, skipping email delivery', {
          documentId,
          sessionId: session.id,
        });
      }
    }

    // Return 200 to acknowledge receipt
    return NextResponse.json({ received: true }, { status: 200 });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Webhook processing failed', {
      error: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
