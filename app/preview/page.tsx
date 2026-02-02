'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GeneratedDocument } from '@/types/document';
import { logger } from '@/lib/logger';

/**
 * Preview page - Smart Preview approach
 * Shows enough content to build trust without giving away full letter
 */
export default function PreviewPage() {
  const router = useRouter();
  const [document, setDocument] = useState<GeneratedDocument | null>(null);
  const [documentId, setDocumentId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    // Get document ID from URL params (passed from redirects) or localStorage
    const urlParams = new URLSearchParams(window.location.search);
    const urlDocId = urlParams.get('documentId');
    const storedDocId = localStorage.getItem('current-document-id');
    
    const docId = urlDocId || storedDocId;
    
    if (!docId) {
      logger.warn('No document ID found on preview page, redirecting to start');
      router.push('/start');
      return;
    }

    setDocumentId(docId);

    // Get document from localStorage (passed from API)
    const storedDoc = localStorage.getItem(`document-${docId}`);
    if (storedDoc) {
      try {
        const parsed = JSON.parse(storedDoc) as GeneratedDocument;
        setDocument(parsed);
        logger.info('Document loaded for preview', { documentId: docId });
      } catch (error) {
        logger.error('Failed to parse stored document', { error, documentId: docId });
      }
    } else {
      logger.warn('Document not found in localStorage', { documentId: docId });
    }

    // Pre-fill email if already collected in contact details
    const formData = localStorage.getItem('immigration-letter-form');
    if (formData) {
      try {
        const parsed = JSON.parse(formData);
        const contactEmail = parsed?.contactDetails?.email;
        if (contactEmail) {
          setEmail(contactEmail);
          logger.info('Pre-filled email from contact details', { email: contactEmail });
        }
      } catch (error) {
        logger.warn('Could not parse form data for email', { error });
      }
    }

    setIsLoading(false);
  }, [router]);

  const handleUnlock = async () => {
    if (!documentId) return;

    setIsPurchasing(true);
    try {
      // DEV MODE: Skip Stripe for testing (set NEXT_PUBLIC_SKIP_PAYMENT=true in .env.local)
      if (process.env.NEXT_PUBLIC_SKIP_PAYMENT === 'true') {
        logger.info('Skipping payment (dev mode)', { documentId });
        
        // Mark document as paid on server (dev mode only)
        await fetch('/api/document/mark-paid', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ documentId }),
        });
        
        router.push(`/editor?documentId=${documentId}`);
        return;
      }

      logger.info('Initiating Stripe checkout', { documentId });

      // Call real Stripe checkout API
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          documentId,
          email: email.trim() || undefined, // Pass email if provided
        }),
      });

      const result = await response.json();

      if (!result.success || !result.data?.url) {
        throw new Error(result.error || 'Failed to create checkout session');
      }

      logger.info('Redirecting to Stripe checkout', {
        documentId,
        sessionId: result.data.sessionId,
      });

      // Redirect to Stripe checkout page
      window.location.href = result.data.url;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error('Checkout failed', { documentId, error: errorMessage });
      alert('Payment failed. Please try again.');
      setIsPurchasing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground-muted">Loading preview...</div>
      </div>
    );
  }

  // Parse document sections for smart preview
  const previewSections = document ? parseDocumentForPreview(document.rawText) : null;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background-elevated">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-foreground-muted hover:text-accent-purple transition-colors group"
          >
            <svg 
              className="w-5 h-5 group-hover:-translate-x-1 transition-transform" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm font-medium">Back</span>
          </Link>
          <div className="h-6 w-px bg-border" />
          <h1 className="text-xl font-semibold text-foreground">
            Immigration Letter Generator
          </h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <Card>
          <CardHeader
            title="Preview Your Letter"
            description="Your immigration letter has been generated. Unlock to edit and download."
          />
          <CardContent>
            <div className="space-y-6">
              {/* Word count badge */}
              {previewSections && (
                <div className="flex items-center gap-2 text-sm">
                  <div className="px-3 py-1.5 bg-accent-purple/10 border border-accent-purple/20 rounded-full text-accent-purple font-medium">
                    {previewSections.wordCount} words
                  </div>
                  <span className="text-foreground-muted">
                    Professional immigration letter ready to customize
                  </span>
                </div>
              )}

              {/* Document preview */}
              <div className="bg-background-elevated p-8 rounded-lg border border-border relative overflow-hidden min-h-[600px]">
                {/* Letter formatting with proper spacing and structure */}
                <div className="font-serif leading-relaxed text-foreground" style={{ lineHeight: '1.8' }}>
                  {previewSections ? (
                    <>
                      {/* Clear opening section with proper letter formatting */}
                      <div className="text-foreground mb-6 whitespace-pre-line">
                        {previewSections.opening}
                      </div>

                      {/* Blurred locked content section */}
                      <div className="relative min-h-[400px]">
                        {/* Blurred text - clearly visible with proper formatting */}
                        <div className="text-foreground filter blur-sm select-none opacity-50 pr-8 whitespace-pre-line">
                          {previewSections.lockedPreview}
                          <div className="mt-6">
                            {previewSections.lockedPreview}
                          </div>
                        </div>

                        {/* Unlock modal - positioned to show blur around it */}
                        <div className="absolute top-12 left-1/2 -translate-x-1/2">
                          <div className="text-center bg-zinc-900/90 backdrop-blur-xl border-2 border-accent-purple/50 rounded-2xl p-8 shadow-2xl w-96">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent-purple/20 flex items-center justify-center">
                              <svg className="w-8 h-8 text-accent-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                              </svg>
                            </div>
                            <h4 className="text-xl font-bold text-white mb-3">
                              Unlock Your Full Letter
                            </h4>
                            <p className="text-sm text-gray-300 mb-6">
                              Get full access to edit, customize, and download as PDF
                            </p>
                            
                            {/* Email input */}
                            <div className="mb-6 text-left">
                              <label htmlFor="email-input" className="block text-sm font-medium text-gray-300 mb-2">
                                Email Address (Optional)
                              </label>
                              <input
                                id="email-input"
                                type="email"
                                placeholder="your.email@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-purple focus:border-transparent transition-all"
                              />
                              <p className="text-xs text-gray-400 mt-2 flex items-center gap-1.5">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                We'll email you a backup copy of your letter
                              </p>
                            </div>

                            <Button
                              variant="primary"
                              size="md"
                              onClick={handleUnlock}
                              isLoading={isPurchasing}
                              className="w-full"
                            >
                              Unlock for $49
                            </Button>
                            <p className="text-xs text-gray-400 mt-4">
                              Secure payment via Stripe • One-time payment • Not legal advice
                            </p>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    // Fallback preview with realistic letter formatting
                    <>
                      <div className="text-foreground mb-6 whitespace-pre-line">
                        <div className="mb-8">
                          <div>123 Main Street</div>
                          <div>New York, NY 10001</div>
                          <div>email@example.com</div>
                          <div>(555) 123-4567</div>
                        </div>
                        <div className="mb-6">January 27, 2026</div>
                        <div className="mb-6">To Whom It May Concern:</div>
                        <p>I am writing to provide additional context regarding my immigration application. My situation requires careful consideration of several important factors...</p>
                      </div>
                      
                      <div className="relative min-h-[400px]">
                        <div className="text-foreground filter blur-sm select-none opacity-50 pr-8">
                          <p className="mb-4">Throughout my time in the United States, I have demonstrated my commitment to contributing positively to this country. My professional background and personal values align with the principles that make this nation strong.</p>
                          <p className="mb-4">I respectfully request your favorable consideration of my application. I am prepared to provide any additional documentation or information that may be helpful in your review process.</p>
                          <p>Sincerely,</p>
                          <p>[Your Name]</p>
                        </div>

                        <div className="absolute top-12 left-1/2 -translate-x-1/2">
                          <div className="text-center bg-zinc-900/90 backdrop-blur-xl border-2 border-accent-purple/50 rounded-2xl p-8 shadow-2xl w-96">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent-purple/20 flex items-center justify-center">
                              <svg className="w-8 h-8 text-accent-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                              </svg>
                            </div>
                            <h4 className="text-xl font-bold text-white mb-3">
                              Unlock Your Full Letter
                            </h4>
                            <p className="text-sm text-gray-300 mb-6">
                              Get full access to edit, customize, and download as PDF
                            </p>
                            
                            {/* Email input */}
                            <div className="mb-6 text-left">
                              <label htmlFor="email-input-fallback" className="block text-sm font-medium text-gray-300 mb-2">
                                Email Address (Optional)
                              </label>
                              <input
                                id="email-input-fallback"
                                type="email"
                                placeholder="your.email@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-purple focus:border-transparent transition-all"
                              />
                              <p className="text-xs text-gray-400 mt-2 flex items-center gap-1.5">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                We'll email you a backup copy of your letter
                              </p>
                            </div>

                            <Button
                              variant="primary"
                              size="md"
                              onClick={handleUnlock}
                              isLoading={isPurchasing}
                              className="w-full"
                            >
                              Unlock for $49
                            </Button>
                            <p className="text-xs text-gray-400 mt-4">
                              Secure payment via Stripe • One-time payment • Not legal advice
                            </p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Trust signal footer */}
                <div className="mt-8 pt-6 border-t border-border">
                  <p className="text-xs text-foreground-muted text-center">
                    Not legal advice • For informational purposes only • Professional formatting included
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/**
 * Helper function to parse document into preview sections
 * Shows limited opening (first ~100-120 words), rest is locked
 * Opening will fade/blur naturally (no hard cutoff)
 */
function parseDocumentForPreview(text: string) {
  // Count words
  const wordCount = text.trim().split(/\s+/).length;

  // Split into paragraphs
  const paragraphs = text.split('\n\n').filter(p => p.trim().length > 0);

  if (paragraphs.length === 0) {
    return null;
  }

  // Opening: First ~120 words (will fade naturally with CSS)
  let opening = '';
  let wordsSoFar = 0;
  let openingParagraphCount = 0;
  
  for (let i = 0; i < paragraphs.length && wordsSoFar < 120; i++) {
    const paragraphWords = paragraphs[i].split(/\s+/).length;
    
    // If adding this paragraph would exceed 120 words, include partial
    if (wordsSoFar + paragraphWords > 120) {
      const words = paragraphs[i].split(/\s+/);
      const wordsToTake = 120 - wordsSoFar;
      opening += words.slice(0, wordsToTake).join(' ');
      break;
    }
    
    opening += paragraphs[i] + '\n\n';
    wordsSoFar += paragraphWords;
    openingParagraphCount++;
  }

  // Locked content: Everything after opening (including closing)
  const remainingParagraphs = paragraphs.slice(openingParagraphCount);
  const lockedPreview = remainingParagraphs.slice(0, 3).join('\n\n');

  return {
    wordCount,
    opening: opening.trim(),
    lockedPreview: lockedPreview || 'Additional context and details...',
  };
}
