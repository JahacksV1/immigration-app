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
    // Get document ID from localStorage
    const storedDocId = localStorage.getItem('current-document-id');
    if (!storedDocId) {
      router.push('/start');
      return;
    }

    // Check if paid
    const isPaid = localStorage.getItem(`document-${storedDocId}-paid`);
    if (!isPaid) {
      router.push('/preview');
      return;
    }

    setDocumentId(storedDocId);

    // Get document
    const storedDoc = localStorage.getItem(`document-${storedDocId}`);
    if (storedDoc) {
      try {
        const parsed = JSON.parse(storedDoc) as GeneratedDocument;
        setDocument(parsed);
        setEditedText(parsed.rawText);
      } catch (error) {
        logger.error('Failed to parse stored document', { error });
      }
    }

    setIsLoading(false);
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
      const a = document.createElement('a');
      a.href = url;
      a.download = 'immigration_letter.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
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
