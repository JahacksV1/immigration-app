import { GeneratedDocument } from '../types/document';
import { logger } from '../lib/logger';
import jsPDF from 'jspdf';

interface PdfResult {
  success: boolean;
  buffer?: Buffer;
  error?: string;
}

export async function generatePDF(document: GeneratedDocument): Promise<PdfResult> {
  try {
    const wordCount = document.rawText.split(/\s+/).length;
    logger.info('Generating PDF', { wordCount });

    const doc = new jsPDF({ format: 'letter', unit: 'pt' });
    doc.setFont('times', 'normal');
    doc.setFontSize(12);

    const leftMargin = 72;
    const rightMargin = 72;
    const topMargin = 72;
    const bottomMargin = 72;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const maxLineWidth = pageWidth - leftMargin - rightMargin;

    const lines = doc.splitTextToSize(document.rawText, maxLineWidth);
    const lineHeight = 12 * 1.6;
    let currentY = topMargin;
    let currentPage = 1;

    for (let i = 0; i < lines.length; i++) {
      if (currentY + lineHeight > pageHeight - bottomMargin) {
        doc.addPage();
        currentPage++;
        currentY = topMargin;
        logger.info('Added new PDF page', { page: currentPage });
      }
      doc.text(lines[i], leftMargin, currentY);
      currentY += lineHeight;
    }

    const pdfOutput = doc.output('arraybuffer');
    const buffer = Buffer.from(pdfOutput);

    logger.info('PDF generated successfully', { size: buffer.length, pages: doc.getNumberOfPages() });
    return { success: true, buffer };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('PDF generation failed', { error: errorMessage });
    return { success: false, error: errorMessage };
  }
}

export function generatePdfFilename(applicantName?: string): string {
  const sanitizedName = applicantName
    ?.replace(/[^a-zA-Z0-9]/g, '_')
    .toLowerCase() || 'applicant';
  const timestamp = new Date().toISOString().split('T')[0];
  return `immigration_letter_${sanitizedName}_${timestamp}.pdf`;
}
