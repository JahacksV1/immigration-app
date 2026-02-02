import { NextRequest } from 'next/server';
import { sendEmailSchema } from '@/lib/validation';
import { apiSuccess, apiError, withErrorHandling } from '@/lib/api-helpers';
import { sendLetterEmail } from '@/lib/services/email-service';
import { logger } from '@/lib/logger';

/**
 * POST /api/send-email
 * Send letter to user via email after payment
 * 
 * Elite Standards:
 * - ZOD validation
 * - Proper error handling
 * - Structured logging
 * - <150 lines
 * 
 * Called by editor page after successful payment
 * Client has document in localStorage and sends it here
 */
export async function POST(req: NextRequest) {
  return withErrorHandling(async () => {
    // Parse request body
    const body = await req.json();

    // Validate input
    const validation = sendEmailSchema.safeParse(body);
    if (!validation.success) {
      logger.warn('Invalid email request', {
        errors: validation.error.flatten(),
      });
      return apiError('Invalid email request', 400, 'VALIDATION_ERROR');
    }

    const { email, documentText, applicantName } = validation.data;

    logger.info('Sending letter email', {
      email,
      applicantName,
      documentLength: documentText.length,
    });

    // Send email via Resend
    const result = await sendLetterEmail({
      to: email,
      documentText,
      applicantName,
    });

    if (!result.success) {
      logger.error('Failed to send email', {
        email,
        error: result.error,
      });
      return apiError(
        result.error || 'Failed to send email',
        500,
        'EMAIL_SEND_ERROR'
      );
    }

    logger.info('Email sent successfully', {
      email,
      emailId: result.data?.emailId,
    });

    return apiSuccess({
      emailId: result.data?.emailId,
      message: 'Email sent successfully',
    });
  }, 'POST /api/send-email');
}
