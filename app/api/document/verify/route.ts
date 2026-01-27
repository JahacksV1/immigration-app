import { NextRequest } from 'next/server';
import { apiSuccess, apiError, withErrorHandling } from '@/lib/api-helpers';
import { getDocument } from '@/lib/services/storage-service';
import { logger } from '@/lib/logger';

/**
 * GET /api/document/verify?documentId=xxx
 * Verify document payment status (server-side check)
 * 
 * Elite Standards:
 * - Server-side verification (security)
 * - Returns document only if paid
 * - <150 lines
 */
export async function GET(req: NextRequest) {
  return withErrorHandling(async () => {
    const documentId = req.nextUrl.searchParams.get('documentId');

    if (!documentId) {
      return apiError('Document ID required', 400, 'MISSING_DOCUMENT_ID');
    }

    logger.info('Verifying document payment status', { documentId });

    // Get document from server storage
    const docResult = getDocument(documentId);

    if (!docResult.success || !docResult.data) {
      logger.warn('Document not found for verification', { documentId });
      return apiError('Document not found or expired', 404, 'DOCUMENT_NOT_FOUND');
    }

    // Check payment status (server-side)
    const isPaid = docResult.data.isPaid;

    logger.info('Document verification complete', {
      documentId,
      isPaid,
    });

    // Return document only if paid
    return apiSuccess({
      isPaid,
      document: isPaid ? {
        sections: docResult.data.sections,
        rawText: docResult.data.rawText,
        generatedAt: docResult.data.generatedAt,
      } : null,
    });
  }, 'GET /api/document/verify');
}
