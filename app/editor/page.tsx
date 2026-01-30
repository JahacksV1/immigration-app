'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { SavedIndicator } from '@/components/ui/SavedIndicator';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GeneratedDocument } from '@/types/document';
import { logger } from '@/lib/logger';
import type { SaveStatus } from '@/hooks/useFormPersistence';

/**
 * Editor page
 * Edit and download purchased letter
 */
export default function EditorPage() {
  const router = useRouter();
  const [document, setDocument] = useState<GeneratedDocument | null>(null);
  const [documentId, setDocumentId] = useState<string | null>(null);
  const [editedText, setEditedText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');

  // Auto-dismiss success banner after 15 seconds
  useEffect(() => {
    if (showSuccessBanner) {
      const timer = setTimeout(() => {
        setShowSuccessBanner(false);
        logger.info('Success banner auto-dismissed');
      }, 15000); // 15 seconds

      return () => clearTimeout(timer);
    }
  }, [showSuccessBanner]);

  useEffect(() => {
    const verifyPaymentAndLoadDocument = async () => {
      try {
        // Get document ID from URL params (passed from Stripe redirect) or localStorage
        const urlParams = new URLSearchParams(window.location.search);
        const sessionId = urlParams.get('session_id');
        const urlDocId = urlParams.get('documentId');
        const storedDocId = localStorage.getItem('current-document-id');
        
        const docId = urlDocId || storedDocId;

        if (!docId) {
          logger.warn('No document ID found, redirecting to start');
          router.push('/start');
          return;
        }

        setDocumentId(docId);

        // Show success banner if coming from Stripe OR from preview (dev mode)
        if (sessionId || urlDocId) {
          setShowSuccessBanner(true);
          logger.info('Payment successful, showing success banner', { 
            sessionId: sessionId || 'dev-mode', 
            documentId: docId 
          });
        }

        // DEV MODE: Skip payment verification (set NEXT_PUBLIC_SKIP_PAYMENT=true in .env.local)
        if (process.env.NEXT_PUBLIC_SKIP_PAYMENT === 'true') {
          logger.info('Skipping payment verification (dev mode)', { documentId: docId });
          const storedDoc = localStorage.getItem(`document-${docId}`);
          if (storedDoc) {
            const parsed = JSON.parse(storedDoc) as GeneratedDocument;
            setDocument(parsed);
            setEditedText(parsed.rawText);
            logger.info('Document loaded from localStorage (dev mode)', { documentId: docId });
          }
          setIsLoading(false);
          return;
        }

        // If we have a session_id, mark document as paid first
        if (sessionId) {
          logger.info('Marking document as paid after Stripe success', { sessionId, documentId: docId });
          await fetch('/api/document/mark-paid', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ documentId: docId }),
          });
        }

        // Verify payment status with SERVER (security!)
        logger.info('Verifying payment status', { documentId: docId, sessionId });
        
        const response = await fetch(`/api/document/verify?documentId=${docId}`);
        const result = await response.json();

        if (!result.success) {
          logger.warn('Verification failed', { documentId: docId, error: result.error });
          router.push('/preview');
          return;
        }

        // Check server-side payment confirmation
        if (!result.data.isPaid) {
          logger.warn('Document not paid, redirecting to preview', { documentId: docId });
          router.push('/preview');
          return;
        }

        // Document is paid - load it
        const verifiedDocument = result.data.document;
        if (verifiedDocument) {
          setDocument(verifiedDocument);
          setEditedText(verifiedDocument.rawText);
          logger.info('Document loaded successfully', { documentId: docId });
        } else {
          // Fallback to localStorage (for compatibility)
          const storedDoc = localStorage.getItem(`document-${docId}`);
          if (storedDoc) {
            const parsed = JSON.parse(storedDoc) as GeneratedDocument;
            setDocument(parsed);
            setEditedText(parsed.rawText);
          }
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        logger.error('Failed to verify payment or load document', { error: errorMessage });
        router.push('/preview');
      } finally {
        setIsLoading(false);
      }
    };

    verifyPaymentAndLoadDocument();
  }, [router]);

  const handleDownload = async () => {
    if (!documentId) return;

    setIsDownloading(true);
    try {
      logger.info('Downloading PDF', { documentId });

      // Send document content to API for PDF generation (Vercel serverless compatible)
      const response = await fetch('/api/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          documentId,
          documentText: editedText,
          applicantName: document?.sections?.[0]?.content?.match(/My name is ([^,]+)/)?.[1] || 'applicant',
        }),
      });

      if (!response.ok) {
        throw new Error(`Download failed: ${response.status}`);
      }

      // Get PDF blob
      const blob = await response.blob();
      
      // Extract filename from Content-Disposition header
      const contentDisposition = response.headers.get('Content-Disposition');
      const filenameMatch = contentDisposition?.match(/filename="(.+)"/);
      const filename = filenameMatch ? filenameMatch[1] : 'immigration_letter.pdf';

      // Trigger download
      const url = URL.createObjectURL(blob);
      const a = window.document.createElement('a');
      a.href = url;
      a.download = filename;
      window.document.body.appendChild(a);
      a.click();
      window.document.body.removeChild(a);
      URL.revokeObjectURL(url);

      logger.info('PDF download complete', { filename });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error('Download failed', { documentId, error: errorMessage });
      alert('Failed to download PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(editedText);
      setIsCopied(true);
      logger.info('Letter copied to clipboard');

      // Reset after 2 seconds
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      logger.error('Failed to copy', { error });
      alert('Failed to copy. Please try again.');
    }
  };

  // Auto-save edited text to localStorage
  const saveEdits = useCallback(() => {
    if (!documentId) return;
    
    setSaveStatus('saving');
    
    try {
      // Save edited version to localStorage
      const editedDoc = {
        ...document,
        rawText: editedText,
      };
      localStorage.setItem(`document-${documentId}`, JSON.stringify(editedDoc));
      logger.info('Edits auto-saved to localStorage');
      
      setTimeout(() => {
        setSaveStatus('saved');
      }, 300);
    } catch (error) {
      logger.error('Failed to save edits', { error });
      setSaveStatus('idle');
    }
  }, [documentId, editedText, document]);

  // Auto-save when editedText changes (debounced)
  useEffect(() => {
    if (!editedText || !documentId) return;
    
    const timeoutId = setTimeout(() => {
      saveEdits();
    }, 1000); // Save 1 second after user stops typing

    return () => clearTimeout(timeoutId);
  }, [editedText, documentId, saveEdits]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground-muted">Loading editor...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background-elevated sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
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
          
          <div className="flex items-center gap-4">
            {/* Saved Indicator */}
            <SavedIndicator status={saveStatus} />
            
            <Button
              variant="primary"
              size="sm"
              onClick={handleDownload}
              isLoading={isDownloading}
            >
              Download PDF
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Success Banner */}
        {showSuccessBanner && (
          <div className="mb-6 bg-accent-purple/10 border border-accent-purple/30 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent-purple/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-accent-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-1">Payment Successful!</h3>
                <p className="text-sm text-foreground-muted">
                  Your letter is ready. Edit as needed, then download as PDF.
                </p>
              </div>
              <button
                onClick={() => setShowSuccessBanner(false)}
                className="text-foreground-muted hover:text-foreground transition-colors"
                aria-label="Dismiss"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Next Steps Section */}
        <div className="mb-4 bg-card border border-border rounded-lg p-5">
          <h4 className="text-lg font-semibold text-foreground mb-3">Next Steps</h4>
          <ol className="space-y-2">
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent-purple/20 flex items-center justify-center text-sm font-semibold text-accent-purple">
                1
              </span>
              <span className="text-foreground-muted">
                Review and edit your letter below
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent-purple/20 flex items-center justify-center text-sm font-semibold text-accent-purple">
                2
              </span>
              <span className="text-foreground-muted">
                Click "Download PDF" when ready
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent-purple/20 flex items-center justify-center text-sm font-semibold text-accent-purple">
                3
              </span>
              <span className="text-foreground-muted">
                Submit with your immigration application
              </span>
            </li>
          </ol>
        </div>

        <Card>
          <CardContent className="py-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-semibold text-foreground">Edit Your Letter</h2>
                <p className="text-sm text-foreground-muted mt-1">Make any changes you need before downloading</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (document) {
                    setEditedText(document.rawText);
                    logger.info('Letter reset to original');
                  }
                }}
              >
                Reset
              </Button>
            </div>
            <div className="space-y-4">
              <Textarea
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                rows={25}
                className="font-serif leading-relaxed"
              />

              <div className="flex items-center justify-between pt-3 border-t border-border">
                <div className="text-sm text-foreground-muted">
                  {editedText.split(/\s+/).filter(w => w).length} words
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleCopy}
                  >
                    {isCopied ? (
                      <>
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Copied!
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Copy Letter
                      </>
                    )}
                  </Button>
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleDownload}
                    isLoading={isDownloading}
                  >
                    Download as PDF
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Support Contact */}
        <div className="mt-6 text-center">
          <p className="text-sm text-foreground-muted">
            Need help? Contact us at{' '}
            <a 
              href="mailto:support@example.com" 
              className="text-accent-purple hover:underline"
            >
              support@example.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
