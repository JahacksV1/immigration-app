import { GeneratedDocument } from '@/types/document';
import { logger } from '@/lib/logger';
import jsPDF from 'jspdf';

/**
 * PDF generation service
 * Converts document to professionally formatted PDF
 * 
 * Elite Standards:
 * - <80 lines (atomic service)
 * - ServiceResult return pattern
 * - Proper error handling
 * - Structured logging
 */

interface PdfResult {
  success: boolean;
  buffer?: Buffer;
  error?: string;
}

/**
 * Generate PDF from document with professional formatting
 */
export async function generatePDF(document: GeneratedDocument): Promise<PdfResult> {
  try {
    const wordCount = document.rawText.split(/\s+/).length;
    logger.info('Generating PDF', { wordCount });

    // Create PDF with letter-sized page
    const doc = new jsPDF({
      format: 'letter',
      unit: 'pt',
    });

    // Set serif font for professional appearance
    doc.setFont('times', 'normal');
    doc.setFontSize(12);

    // Page margins and dimensions
    const leftMargin = 72;  // 1 inch
    const rightMargin = 72;
    const topMargin = 72;
    const bottomMargin = 72;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const maxLineWidth = pageWidth - leftMargin - rightMargin;

    // Split text into lines that fit the page width
    const lines = doc.splitTextToSize(document.rawText, maxLineWidth);

    // Calculate line height (font size * line height factor)
    const fontSize = 12;
    const lineHeight = fontSize * 1.6;

    // Add text with automatic pagination
    let currentY = topMargin;
    let currentPage = 1;

    for (let i = 0; i < lines.length; i++) {
      // Check if we need a new page
      if (currentY + lineHeight > pageHeight - bottomMargin) {
        doc.addPage();
        currentPage++;
        currentY = topMargin;
        logger.info('Added new PDF page', { page: currentPage });
      }

      // Add line to PDF
      doc.text(lines[i], leftMargin, currentY);
      currentY += lineHeight;
    }

    // Convert to buffer
    const pdfOutput = doc.output('arraybuffer');
    const buffer = Buffer.from(pdfOutput);

    logger.info('PDF generated successfully', {
      size: buffer.length,
      pages: doc.getNumberOfPages(),
    });

    return { success: true, buffer };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('PDF generation failed', { error: errorMessage });
    return { success: false, error: errorMessage };
  }
}

/**
 * Generate downloadable filename
 */
export function generatePdfFilename(applicantName?: string): string {
  const sanitizedName = applicantName
    ?.replace(/[^a-zA-Z0-9]/g, '_')
    .toLowerCase() || 'applicant';
  const timestamp = new Date().toISOString().split('T')[0];
  return `immigration_letter_${sanitizedName}_${timestamp}.pdf`;
}
