import { NextRequest, NextResponse } from 'next/server';
import { getDocument } from '@/lib/services/storage-service';
import { generatePDF, generatePdfFilename } from '@/lib/services/pdf-service';
import { apiError, withErrorHandling } from '@/lib/api-helpers';
import { logger } from '@/lib/logger';

/**
 * GET /api/download?documentId=xxx
 * Download generated letter as PDF
 */
export async function GET(req: NextRequest) {
  return withErrorHandling(async () => {
    const documentId = req.nextUrl.searchParams.get('documentId');

    if (!documentId) {
      return apiError('Document ID required', 400, 'MISSING_DOCUMENT_ID');
    }

    // Get document
    const docResult = getDocument(documentId);
    if (!docResult.success || !docResult.data) {
      return apiError('Document not found or expired', 404, 'DOCUMENT_NOT_FOUND');
    }

    // Check if paid
    if (!docResult.data.isPaid) {
      return apiError('Payment required', 402, 'PAYMENT_REQUIRED');
    }

    // Generate PDF
    const pdfResult = await generatePDF(docResult.data);
    if (!pdfResult.success || !pdfResult.buffer) {
      return apiError('Failed to generate PDF', 500, 'PDF_GENERATION_ERROR');
    }

    const filename = generatePdfFilename(docResult.data.formData.aboutYou.fullName);

    logger.info('PDF downloaded', {
      documentId,
      filename,
      size: pdfResult.buffer.length,
    });

    // Return PDF file
    return new NextResponse(pdfResult.buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': pdfResult.buffer.length.toString(),
      },
    });
  }, 'GET /api/download');
}
