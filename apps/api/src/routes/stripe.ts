import { Router, Request, Response } from 'express';
import Stripe from 'stripe';
import { createCheckoutSchema } from '../lib/validation';
import { apiSuccess, apiError } from '../lib/helpers';
import { markDocumentAsPaid } from '../services/storage-service';
import { logger } from '../lib/logger';

export const stripeRouter = Router();

stripeRouter.post('/stripe/create-checkout', async (req: Request, res: Response) => {
  try {
    const validation = createCheckoutSchema.safeParse(req.body);
    if (!validation.success) {
      logger.warn('Invalid checkout request', { errors: validation.error.flatten() });
      return apiError(res, 'Invalid document ID', 400, 'VALIDATION_ERROR');
    }

    const { documentId, email } = validation.data;
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    const stripePriceId = process.env.STRIPE_PRICE_ID;
    const appUrl = process.env.APP_URL;

    if (!stripeSecretKey) {
      logger.error('Stripe secret key not configured');
      return apiError(res, 'Payment system not configured', 500, 'STRIPE_NOT_CONFIGURED');
    }
    if (!stripePriceId) {
      logger.error('Stripe price ID not configured');
      return apiError(res, 'Payment system not configured', 500, 'STRIPE_PRICE_NOT_CONFIGURED');
    }
    if (!appUrl) {
      logger.error('App URL not configured');
      return apiError(res, 'Payment system not configured', 500, 'APP_URL_NOT_CONFIGURED');
    }

    const stripe = new Stripe(stripeSecretKey.trim());
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: stripePriceId, quantity: 1 }],
      mode: 'payment',
      success_url: `${appUrl}/editor?session_id={CHECKOUT_SESSION_ID}&documentId=${documentId}`,
      cancel_url: `${appUrl}/preview?documentId=${documentId}`,
      customer_email: email || undefined,
      metadata: { documentId, userEmail: email || '' },
    });

    logger.info('Stripe checkout session created', { documentId, sessionId: session.id });
    return apiSuccess(res, { sessionId: session.id, url: session.url });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Unhandled error in POST /api/stripe/create-checkout', { error: errorMessage });
    return apiError(res, 'Internal server error', 500);
  }
});

// Webhook uses raw body — registered with express.raw() in index.ts
stripeRouter.post('/stripe/webhook', async (req: Request, res: Response) => {
  try {
    const body = req.body as Buffer;
    const signature = req.headers['stripe-signature'] as string;

    if (!signature) {
      logger.warn('Webhook received without signature');
      return res.status(400).json({ error: 'No signature provided' });
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      logger.error('Stripe webhook secret not configured');
      return res.status(500).json({ error: 'Webhook not configured' });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.warn('Webhook signature verification failed', { error: errorMessage });
      return res.status(400).json({ error: 'Invalid signature' });
    }

    logger.info('Webhook received', { type: event.type, id: event.id });

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const documentId = session.metadata?.documentId;

      if (!documentId) {
        logger.warn('Webhook missing documentId in metadata', { sessionId: session.id });
        return res.status(200).json({ received: true });
      }

      const result = markDocumentAsPaid(documentId);
      if (!result.success) {
        logger.error('Failed to mark document as paid', { documentId, error: result.error });
      } else {
        logger.info('Payment confirmed, document unlocked', {
          documentId,
          sessionId: session.id,
          amount: session.amount_total,
        });
      }
    }

    return res.status(200).json({ received: true });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Webhook processing failed', { error: errorMessage });
    return res.status(500).json({ error: 'Internal server error' });
  }
});
