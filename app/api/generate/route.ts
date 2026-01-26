import { NextRequest } from 'next/server';
import { generateLetterSchema } from '@/lib/validation';
import { apiSuccess, apiError, withErrorHandling } from '@/lib/api-helpers';
import { generateLetter } from '@/lib/services/ai-service';
import { storeDocument, generateDocumentId } from '@/lib/services/storage-service';
import { logger } from '@/lib/logger';

/**
 * POST /api/generate
 * Generate immigration letter from form data
 */
export async function POST(req: NextRequest) {
  return withErrorHandling(async () => {
    // Parse request body
    const body = await req.json();

    // Validate input
    const validation = generateLetterSchema.safeParse(body);
    if (!validation.success) {
      logger.warn('Invalid generate request', {
        errors: validation.error.flatten(),
      });
      return apiError('Invalid form data', 400, 'VALIDATION_ERROR');
    }

    const { formData } = validation.data;

    // Generate letter via AI
    const result = await generateLetter(formData);

    if (!result.success || !result.document) {
      return apiError(result.error || 'Failed to generate letter', 500, 'GENERATION_ERROR');
    }

    // Store document temporarily
    const documentId = generateDocumentId();
    const storeResult = storeDocument(documentId, {
      ...result.document,
      formData,
      isPaid: false,
    });

    if (!storeResult.success) {
      return apiError('Failed to store document', 500, 'STORAGE_ERROR');
    }

    logger.info('Letter generated and stored', {
      documentId,
      applicant: formData.aboutYou.fullName,
    });

    return apiSuccess({
      documentId,
      document: result.document,
    });
  }, 'POST /api/generate');
}
