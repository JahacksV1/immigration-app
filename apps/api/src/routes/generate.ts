import { Router, Request, Response } from 'express';
import { generateLetterSchema } from '../lib/validation';
import { apiSuccess, apiError } from '../lib/helpers';
import { generateLetter } from '../services/ai-service';
import { storeDocument, generateDocumentId } from '../services/storage-service';
import { logger } from '../lib/logger';

export const generateRouter = Router();

generateRouter.post('/generate', async (req: Request, res: Response) => {
  try {
    const validation = generateLetterSchema.safeParse(req.body);
    if (!validation.success) {
      logger.warn('Invalid generate request', { errors: validation.error.flatten() });
      return apiError(res, 'Invalid form data', 400, 'VALIDATION_ERROR');
    }

    const { formData } = validation.data;
    const result = await generateLetter(formData);

    if (!result.success || !result.document) {
      return apiError(res, result.error || 'Failed to generate letter', 500, 'GENERATION_ERROR');
    }

    const documentId = generateDocumentId();
    const storeResult = storeDocument(documentId, { ...result.document, formData, isPaid: false });

    if (!storeResult.success) {
      return apiError(res, 'Failed to store document', 500, 'STORAGE_ERROR');
    }

    logger.info('Letter generated and stored', { documentId, applicant: formData.aboutYou.fullName });
    return apiSuccess(res, { documentId, document: result.document });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Unhandled error in POST /api/generate', { error: errorMessage });
    return apiError(res, 'Internal server error', 500);
  }
});
