import { NextRequest } from 'next/server';
import { z } from 'zod';
import { apiSuccess, apiError, withErrorHandling } from '@/lib/api-helpers';
import { markDocumentAsPaid } from '@/lib/services/storage-service';
import { logger } from '@/lib/logger';

/**
 * POST /api/document/mark-paid
 * Mark document as paid (for dev mode / webhook)
 * 
 * Elite Standards:
 * - ZOD validation
 * - Proper logging
 * - <150 lines
 */

const requestSchema = z.object({
  documentId: z.string().min(1),
});

export async function POST(req: NextRequest) {
  return withErrorHandling(async () => {
    const body = await req.json();

    // Validate input
    const validation = requestSchema.safeParse(body);
    if (!validation.success) {
      return apiError('Invalid document ID', 400, 'VALIDATION_ERROR');
    }

    const { documentId } = validation.data;

    logger.info('Marking document as paid', { documentId });

    // Mark as paid
    const result = markDocumentAsPaid(documentId);

    if (!result.success) {
      return apiError(result.error || 'Failed to mark as paid', 400, 'MARK_PAID_ERROR');
    }

    logger.info('Document marked as paid successfully', { documentId });

    return apiSuccess({ documentId, isPaid: true });
  }, 'POST /api/document/mark-paid');
}
