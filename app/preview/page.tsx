'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GeneratedDocument } from '@/types/document';
import { logger } from '@/lib/logger';

/**
 * Preview page
 * Shows blurred document + unlock CTA
 */
export default function PreviewPage() {
  const router = useRouter();
  const [document, setDocument] = useState<GeneratedDocument | null>(null);
  const [documentId, setDocumentId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState(false);

  useEffect(() => {
    // Get document ID from localStorage
    const storedDocId = localStorage.getItem('current-document-id');
    if (!storedDocId) {
      router.push('/start');
      return;
    }

    setDocumentId(storedDocId);

    // Get document from localStorage (passed from API)
    const storedDoc = localStorage.getItem(`document-${storedDocId}`);
    if (storedDoc) {
      try {
        const parsed = JSON.parse(storedDoc) as GeneratedDocument;
        setDocument(parsed);
      } catch (error) {
        logger.error('Failed to parse stored document', { error });
      }
    }

    setIsLoading(false);
  }, [router]);

  const handleUnlock = async () => {
    if (!documentId) return;

    setIsPurchasing(true);
    try {
      // TODO: Call Stripe checkout API
      // For now, mock payment success
      logger.info('Initiating checkout', { documentId });

      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock successful payment
      localStorage.setItem(`document-${documentId}-paid`, 'true');

      logger.info('Payment successful (mock)');
      router.push('/editor');
    } catch (error) {
      logger.error('Checkout failed', { error });
      alert('Payment failed. Please try again.');
    } finally {
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

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background-elevated">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Link href="/" className="text-xl font-semibold text-foreground hover:text-accent-purple transition-colors">
            Immigration Letter Generator
          </Link>
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
              <div className="bg-background-elevated p-8 rounded-lg border border-border relative overflow-hidden min-h-[500px]">
                <div className="filter blur-sm select-none">
                  {document ? (
                    <div className="prose prose-invert max-w-none">
                      {document.sections.map((section, index) => (
                        <div key={index} className="mb-6">
                          {section.heading && (
                            <h3 className="text-lg font-semibold text-foreground mb-2">
                              {section.heading}
                            </h3>
                          )}
                          <div className="text-foreground-muted whitespace-pre-wrap">
                            {section.content.substring(0, 300)}...
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Letter of Explanation</h3>
                      <p className="mb-4">Dear Immigration Officer,</p>
                      <p className="mb-4">
                        I am writing to provide additional context regarding my application...
                      </p>
                    </div>
                  )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/60 to-background flex items-center justify-center">
                  <div className="text-center bg-card/90 backdrop-blur-sm border border-accent-purple/30 rounded-lg p-8 shadow-glow">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent-purple/20 flex items-center justify-center">
                      <svg className="w-8 h-8 text-accent-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <h4 className="text-xl font-semibold text-foreground mb-2">
                      Unlock Your Full Letter
                    </h4>
                    <p className="text-foreground-muted mb-6 max-w-sm">
                      Get full access to edit, customize, and download your letter as PDF
                    </p>
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={handleUnlock}
                      isLoading={isPurchasing}
                      className="min-w-[200px]"
                    >
                      Unlock for $49
                    </Button>
                    <p className="text-xs text-foreground-muted mt-4">
                      Secure payment via Stripe • Instant access
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
