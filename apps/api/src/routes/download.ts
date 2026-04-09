import { Router, Request, Response } from 'express';
import { generatePDF, generatePdfFilename } from '../services/pdf-service';
import { apiError } from '../lib/helpers';
import { logger } from '../lib/logger';

export const downloadRouter = Router();

downloadRouter.post('/download', async (req: Request, res: Response) => {
  try {
    const { documentId, documentText, applicantName } = req.body;

    if (!documentId || !documentText) {
      return apiError(res, 'Document ID and text required', 400, 'MISSING_DOCUMENT_DATA');
    }

    logger.info('Generating PDF from client data', {
      documentId,
      wordCount: documentText.split(/\s+/).length,
    });

    const document = { sections: [], rawText: documentText, generatedAt: new Date().toISOString() };
    const pdfResult = await generatePDF(document);

    if (!pdfResult.success || !pdfResult.buffer) {
      return apiError(res, 'Failed to generate PDF', 500, 'PDF_GENERATION_ERROR');
    }

    const filename = generatePdfFilename(applicantName);
    logger.info('PDF downloaded', { documentId, filename, size: pdfResult.buffer.length });

    res.status(200)
      .set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': pdfResult.buffer.length.toString(),
      })
      .send(pdfResult.buffer);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Unhandled error in POST /api/download', { error: errorMessage });
    return apiError(res, 'Internal server error', 500);
  }
});
