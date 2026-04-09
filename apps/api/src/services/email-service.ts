import { Resend } from 'resend';
import { logger } from '../lib/logger';
import { generatePDF, generatePdfFilename } from './pdf-service';

interface ServiceResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

interface SendLetterEmailParams {
  to: string;
  documentText: string;
  applicantName: string;
}

export async function sendLetterEmail(
  params: SendLetterEmailParams
): Promise<ServiceResult<{ emailId: string }>> {
  try {
    const { to, documentText, applicantName } = params;

    if (!to || !to.includes('@')) {
      return { success: false, error: 'Invalid email address' };
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      logger.error('Resend API key not configured');
      return { success: false, error: 'Email service not configured' };
    }

    const resend = new Resend(resendApiKey);

    const document = { sections: [], rawText: documentText, generatedAt: new Date().toISOString() };
    const pdfResult = await generatePDF(document);
    if (!pdfResult.success || !pdfResult.buffer) {
      logger.error('Failed to generate PDF for email', { to });
      return { success: false, error: 'Failed to generate PDF' };
    }

    const filename = generatePdfFilename(applicantName);
    logger.info('Sending letter email with PDF attachment', { to, applicantName, filename });

    const { data, error } = await resend.emails.send({
      from: 'Immigration Letter <noreply@immigrationdoc.app>',
      to: [to],
      subject: 'Your Immigration Explanation Letter',
      html: generateEmailHtml(applicantName),
      text: generateEmailText(applicantName),
      attachments: [{ filename, content: pdfResult.buffer.toString('base64') }],
    });

    if (error) {
      logger.error('Failed to send email via Resend', { error: error.message, to });
      return { success: false, error: error.message };
    }

    logger.info('Email sent successfully', { emailId: data?.id, to });
    return { success: true, data: { emailId: data?.id || 'unknown' } };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Email service error', { error: errorMessage, to: params.to });
    return { success: false, error: errorMessage };
  }
}

function generateEmailHtml(applicantName: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 0; }
    .header { background: #6366f1; color: white; padding: 30px 20px; text-align: center; }
    .content { background: #ffffff; padding: 40px 30px; }
    .attachment-box { background: #f9fafb; border: 2px dashed #d1d5db; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0; }
    .footer { background: #f9fafb; text-align: center; padding: 20px; color: #6b7280; font-size: 12px; border-top: 1px solid #e5e7eb; }
    ul { padding-left: 20px; }
    li { margin: 8px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0; font-size: 24px;">Your Immigration Letter is Ready</h1>
    </div>
    <div class="content">
      <p style="font-size: 16px; margin-top: 0;">Hello ${applicantName},</p>
      <p>Thank you for your purchase! Your personalized immigration explanation letter is attached to this email as a PDF.</p>
      <div class="attachment-box">
        <p style="margin: 0; font-weight: 600; color: #1f2937;">Immigration Letter (PDF)</p>
        <p style="margin: 5px 0 0 0; font-size: 14px; color: #6b7280;">Scroll to the bottom of this email to download the attachment.</p>
      </div>
      <p><strong>Next Steps:</strong></p>
      <ol style="line-height: 1.8;">
        <li>Download the attached PDF</li>
        <li>Review the content carefully</li>
        <li>Submit with your immigration application</li>
      </ol>
      <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 30px 0; border-radius: 4px;">
        <p style="margin: 0; font-size: 14px; color: #92400e;">
          <strong>Important:</strong> This letter is for informational purposes only and does not constitute legal advice.
        </p>
      </div>
    </div>
    <div class="footer">
      <p style="margin: 5px 0;"><a href="mailto:immigrationexplanationletter@gmail.com" style="color: #6366f1; text-decoration: none;">immigrationexplanationletter@gmail.com</a></p>
      <p style="margin: 15px 0 5px 0;">© ${new Date().getFullYear()} Immigration Explanation Letter</p>
    </div>
  </div>
</body>
</html>`.trim();
}

function generateEmailText(applicantName: string): string {
  return `Your Immigration Letter is Ready

Hello ${applicantName},

Thank you for your purchase! Your personalized immigration explanation letter is attached to this email as a PDF.

Next Steps:
1. Download the attached PDF
2. Review the content carefully
3. Submit with your immigration application

IMPORTANT: This letter is for informational purposes only and does not constitute legal advice.

© ${new Date().getFullYear()} Immigration Explanation Letter`.trim();
}
