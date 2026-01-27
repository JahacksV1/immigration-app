'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GeneratedDocument } from '@/types/document';
import { logger } from '@/lib/logger';

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

      // TODO: Call download API
      // For now, download as text file
      const blob = new Blob([editedText], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = window.document.createElement('a');
      a.href = url;
      a.download = 'immigration_letter.txt';
      window.document.body.appendChild(a);
      a.click();
      window.document.body.removeChild(a);
      URL.revokeObjectURL(url);

      logger.info('Download complete');
    } catch (error) {
      logger.error('Download failed', { error });
      alert('Failed to download. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground-muted">Loading editor...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background-elevated">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-semibold text-foreground hover:text-accent-purple transition-colors">
            Immigration Letter Generator
          </Link>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (document) {
                  setEditedText(document.rawText);
                }
              }}
            >
              Reset
            </Button>
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
        <Card>
          <CardHeader
            title="Edit Your Letter"
            description="Make any changes you need before downloading"
          />
          <CardContent>
            <div className="space-y-6">
              <Textarea
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                rows={25}
                className="font-mono text-sm"
              />

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="text-sm text-foreground-muted">
                  {editedText.split(/\s+/).filter(w => w).length} words
                </div>
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
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-sm text-foreground-muted">
            Review your letter carefully before submitting with your immigration application
          </p>
        </div>
      </div>
    </div>
  );
}
