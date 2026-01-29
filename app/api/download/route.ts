import { NextRequest, NextResponse } from 'next/server';
import { generatePDF, generatePdfFilename } from '@/lib/services/pdf-service';
import { apiError } from '@/lib/api-helpers';
import { logger } from '@/lib/logger';

/**
 * GET /api/download?documentId=xxx
 * Download generated letter as PDF
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { documentId, documentText, applicantName } = body;

    if (!documentId || !documentText) {
      return apiError('Document ID and text required', 400, 'MISSING_DOCUMENT_DATA');
    }

    logger.info('Generating PDF from client data', { 
      documentId,
      wordCount: documentText.split(/\s+/).length,
    });

    // Create document object for PDF generation
    const document = {
      sections: [],
      rawText: documentText,
      generatedAt: new Date().toISOString(),
    };

    // Generate PDF
    const pdfResult = await generatePDF(document);
    if (!pdfResult.success || !pdfResult.buffer) {
      return apiError('Failed to generate PDF', 500, 'PDF_GENERATION_ERROR');
    }

    const filename = generatePdfFilename(applicantName);

    logger.info('PDF downloaded', {
      documentId,
      filename,
      size: pdfResult.buffer.length,
    });

    // Convert Buffer to Uint8Array for web-standard response
    const uint8Array = new Uint8Array(pdfResult.buffer);

    // Return PDF file
    return new NextResponse(uint8Array, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': pdfResult.buffer.length.toString(),
      },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Unhandled API error', {
      context: 'GET /api/download',
      error: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
    });
    return apiError('Internal server error', 500);
  }
}
