import { Router, Request, Response } from 'express';
import { sendEmailSchema } from '../lib/validation';
import { apiSuccess, apiError } from '../lib/helpers';
import { sendLetterEmail } from '../services/email-service';
import { logger } from '../lib/logger';

export const sendEmailRouter = Router();

sendEmailRouter.post('/send-email', async (req: Request, res: Response) => {
  try {
    const validation = sendEmailSchema.safeParse(req.body);
    if (!validation.success) {
      logger.warn('Invalid email request', { errors: validation.error.flatten() });
      return apiError(res, 'Invalid email request', 400, 'VALIDATION_ERROR');
    }

    const { email, documentText, applicantName } = validation.data;
    logger.info('Sending letter email', { email, applicantName });

    const result = await sendLetterEmail({ to: email, documentText, applicantName });
    if (!result.success) {
      logger.error('Failed to send email', { email, error: result.error });
      return apiError(res, result.error || 'Failed to send email', 500, 'EMAIL_SEND_ERROR');
    }

    logger.info('Email sent successfully', { email, emailId: result.data?.emailId });
    return apiSuccess(res, { emailId: result.data?.emailId, message: 'Email sent successfully' });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Unhandled error in POST /api/send-email', { error: errorMessage });
    return apiError(res, 'Internal server error', 500);
  }
});
