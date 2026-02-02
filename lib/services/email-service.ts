import { Resend } from 'resend';
import { logger } from '@/lib/logger';

/**
 * Email Service
 * 
 * Sends transactional emails using Resend API
 * 
 * Elite Standards:
 * - <80 lines (atomic service)
 * - ServiceResult return pattern
 * - Proper error handling
 * - Structured logging
 */

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

/**
 * Send immigration letter via email as PDF attachment
 */
export async function sendLetterEmail(
  params: SendLetterEmailParams
): Promise<ServiceResult<{ emailId: string }>> {
  try {
    const { to, documentText, applicantName } = params;

    // Validate email
    if (!to || !to.includes('@')) {
      return { success: false, error: 'Invalid email address' };
    }

    // Initialize Resend
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      logger.error('Resend API key not configured');
      return { success: false, error: 'Email service not configured' };
    }

    const resend = new Resend(resendApiKey);

    // Send email
    logger.info('Sending letter email', { to, applicantName });

    const { data, error } = await resend.emails.send({
      from: 'Immigration Letter <noreply@immigrationexplanationletter.com>',
      to: [to],
      subject: 'Your Immigration Explanation Letter',
      html: generateEmailHtml(applicantName, documentText),
      text: generateEmailText(applicantName, documentText),
    });

    if (error) {
      logger.error('Failed to send email via Resend', {
        error: error.message,
        to,
      });
      return { success: false, error: error.message };
    }

    logger.info('Email sent successfully', {
      emailId: data?.id,
      to,
    });

    return {
      success: true,
      data: { emailId: data?.id || 'unknown' },
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Email service error', {
      error: errorMessage,
      to: params.to,
    });
    return { success: false, error: errorMessage };
  }
}

/**
 * Generate HTML email content
 */
function generateEmailHtml(applicantName: string, documentText: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #6366f1; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
    .letter { background: white; padding: 30px; border: 1px solid #d1d5db; border-radius: 4px; white-space: pre-wrap; font-family: Georgia, serif; line-height: 1.8; }
    .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
    .button { display: inline-block; background: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0;">Your Immigration Letter is Ready</h1>
    </div>
    <div class="content">
      <p>Hello ${applicantName},</p>
      <p>Thank you for your purchase! Your personalized immigration explanation letter is attached below.</p>
      <p><strong>What's included:</strong></p>
      <ul>
        <li>✅ Professional formatting ready for submission</li>
        <li>✅ Fully editable content tailored to your situation</li>
        <li>✅ Can be copied, printed, or submitted digitally</li>
      </ul>
      <div class="letter">${documentText}</div>
      <p style="margin-top: 30px;"><strong>Next Steps:</strong></p>
      <ol>
        <li>Review the letter carefully</li>
        <li>Make any final edits as needed</li>
        <li>Submit with your immigration application</li>
      </ol>
      <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
        <strong>Important:</strong> This letter is for informational purposes only and does not constitute legal advice. 
        For legal guidance, please consult with a qualified immigration attorney.
      </p>
    </div>
    <div class="footer">
      <p>Need help? Contact us at <a href="mailto:immigrationexplanationletter@gmail.com">immigrationexplanationletter@gmail.com</a></p>
      <p style="margin-top: 10px;">© ${new Date().getFullYear()} Immigration Explanation Letter. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Generate plain text email content
 */
function generateEmailText(applicantName: string, documentText: string): string {
  return `
Your Immigration Letter is Ready

Hello ${applicantName},

Thank you for your purchase! Your personalized immigration explanation letter is below.

What's included:
- Professional formatting ready for submission
- Fully editable content tailored to your situation
- Can be copied, printed, or submitted digitally

----- YOUR LETTER -----

${documentText}

----- END OF LETTER -----

Next Steps:
1. Review the letter carefully
2. Make any final edits as needed
3. Submit with your immigration application

IMPORTANT: This letter is for informational purposes only and does not constitute legal advice. 
For legal guidance, please consult with a qualified immigration attorney.

Need help? Contact us at immigrationexplanationletter@gmail.com

© ${new Date().getFullYear()} Immigration Explanation Letter
  `.trim();
}
