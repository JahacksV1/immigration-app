import { NextRequest } from 'next/server';
import Stripe from 'stripe';
import { createCheckoutSchema } from '@/lib/validation';
import { apiSuccess, apiError, withErrorHandling } from '@/lib/api-helpers';
import { logger } from '@/lib/logger';

/**
 * POST /api/stripe/create-checkout
 * Create Stripe checkout session for document purchase
 */
export async function POST(req: NextRequest) {
  return withErrorHandling(async () => {
    // Parse request body
    const body = await req.json();

    // Validate input
    const validation = createCheckoutSchema.safeParse(body);
    if (!validation.success) {
      logger.warn('Invalid checkout request', {
        errors: validation.error.flatten(),
      });
      return apiError('Invalid document ID', 400, 'VALIDATION_ERROR');
    }

    const { documentId } = validation.data;

    // Note: Skip server-side document verification for serverless compatibility
    // Document is stored in localStorage on client side
    // We only need documentId to create checkout session and track payment
    logger.info('Creating checkout for document', { documentId });

    // Initialize Stripe
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    const stripePriceId = process.env.STRIPE_PRICE_ID;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;

    // Log environment variables (without exposing full keys)
    logger.info('=== STRIPE ENV CHECK ===', {
      hasSecretKey: !!stripeSecretKey,
      secretKeyPrefix: stripeSecretKey ? stripeSecretKey.substring(0, 15) + '...' : 'MISSING',
      secretKeyLength: stripeSecretKey?.length,
      hasPriceId: !!stripePriceId,
      priceIdPrefix: stripePriceId ? stripePriceId.substring(0, 15) + '...' : 'MISSING',
      priceIdLength: stripePriceId?.length,
      hasAppUrl: !!appUrl,
      appUrl,
    });

    if (!stripeSecretKey) {
      logger.error('Stripe secret key not configured');
      return apiError('Payment system not configured', 500, 'STRIPE_NOT_CONFIGURED');
    }

    if (!stripePriceId) {
      logger.error('Stripe price ID not configured');
      return apiError('Payment system not configured', 500, 'STRIPE_PRICE_NOT_CONFIGURED');
    }

    if (!appUrl) {
      logger.error('App URL not configured');
      return apiError('Payment system not configured', 500, 'APP_URL_NOT_CONFIGURED');
    }

    // Initialize Stripe (trim any whitespace from key)
    const stripe = new Stripe(stripeSecretKey.trim());

    logger.info('Creating Stripe checkout session', { documentId });

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: stripePriceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${appUrl}/editor?session_id={CHECKOUT_SESSION_ID}&documentId=${documentId}`,
      cancel_url: `${appUrl}/preview?documentId=${documentId}`,
      metadata: {
        documentId,
      },
    });

    logger.info('Stripe checkout session created', {
      documentId,
      sessionId: session.id,
    });

    return apiSuccess({
      sessionId: session.id,
      url: session.url,
    });
  }, 'POST /api/stripe/create-checkout');
}
