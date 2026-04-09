import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { apiSuccess, apiError } from '../lib/helpers';
import { getDocument, markDocumentAsPaid } from '../services/storage-service';
import { logger } from '../lib/logger';

export const documentRouter = Router();

documentRouter.get('/document/verify', async (req: Request, res: Response) => {
  try {
    const documentId = req.query.documentId as string;

    if (!documentId) {
      return apiError(res, 'Document ID required', 400, 'MISSING_DOCUMENT_ID');
    }

    logger.info('Verifying document payment status', { documentId });

    const docResult = getDocument(documentId);
    if (!docResult.success || !docResult.data) {
      logger.warn('Document not found for verification', { documentId });
      return apiError(res, 'Document not found or expired', 404, 'DOCUMENT_NOT_FOUND');
    }

    const isPaid = docResult.data.isPaid;
    logger.info('Document verification complete', { documentId, isPaid });

    return apiSuccess(res, {
      isPaid,
      document: isPaid
        ? { sections: docResult.data.sections, rawText: docResult.data.rawText, generatedAt: docResult.data.generatedAt }
        : null,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Unhandled error in GET /api/document/verify', { error: errorMessage });
    return apiError(res, 'Internal server error', 500);
  }
});

const markPaidSchema = z.object({ documentId: z.string().min(1) });

documentRouter.post('/document/mark-paid', async (req: Request, res: Response) => {
  try {
    const validation = markPaidSchema.safeParse(req.body);
    if (!validation.success) {
      return apiError(res, 'Invalid document ID', 400, 'VALIDATION_ERROR');
    }

    const { documentId } = validation.data;
    logger.info('Marking document as paid', { documentId });

    const result = markDocumentAsPaid(documentId);
    if (!result.success) {
      return apiError(res, result.error || 'Failed to mark as paid', 400, 'MARK_PAID_ERROR');
    }

    logger.info('Document marked as paid successfully', { documentId });
    return apiSuccess(res, { documentId, isPaid: true });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Unhandled error in POST /api/document/mark-paid', { error: errorMessage });
    return apiError(res, 'Internal server error', 500);
  }
});
