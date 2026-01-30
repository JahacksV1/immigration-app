import { Card, CardContent } from '@/components/ui/Card';
import type { LetterPreviewProps } from '@/types/example';

/**
 * Letter Preview Component
 *
 * Displays a formatted example letter with optional metadata.
 * Pure presentation component - receives letter data via props.
 *
 * Features:
 * - Professional letter formatting
 * - Optional metadata badges (word count, paragraph count)
 * - "Best for" guidance section
 * - Responsive design
 *
 * @example
 * ```tsx
 * <LetterPreview
 *   letter={exampleLetter}
 *   showMetadata={true}
 * />
 * ```
 */
export function LetterPreview({
  letter,
  showMetadata = false,
}: LetterPreviewProps) {
  return (
    <div className="w-full space-y-4">
      {/* Title and Description */}
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-foreground">
          {letter.title}
        </h2>
        <p className="text-sm text-foreground-muted">{letter.description}</p>
      </div>

      {/* Metadata Badges */}
      {showMetadata && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-accent-purple/10 text-accent-purple border border-accent-purple/20">
            {letter.wordCount} words
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-accent-purple/10 text-accent-purple border border-accent-purple/20">
            {letter.paragraphCount} paragraphs
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-card text-foreground-muted border border-border capitalize">
            {letter.template} template
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-card text-foreground-muted border border-border capitalize">
            {letter.tone} tone
          </span>
        </div>
      )}

      {/* Letter Content Card */}
      <Card padding="lg" className="bg-white">
        <CardContent>
          <div
            className="prose prose-sm sm:prose max-w-none
              prose-headings:font-semibold prose-headings:text-foreground
              prose-p:text-foreground prose-p:leading-relaxed
              prose-strong:text-foreground prose-strong:font-semibold"
          >
            <pre className="whitespace-pre-wrap font-serif text-base leading-relaxed text-gray-900">
              {letter.letterText}
            </pre>
          </div>
        </CardContent>
      </Card>

      {/* Best For Section */}
      <Card className="bg-gradient-to-br from-accent-purple/5 to-accent-purple/10 border-accent-purple/20">
        <CardContent>
          <div className="flex items-start gap-3">
            {/* Info Icon */}
            <div className="flex-shrink-0 mt-0.5">
              <svg
                className="w-5 h-5 text-accent-purple"
                fill="none"
                strokeWidth="2"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>

            {/* Content */}
            <div className="flex-1 space-y-1">
              <p className="text-sm font-semibold text-accent-purple">
                Best suited for:
              </p>
              <p className="text-sm text-foreground leading-relaxed">
                {letter.bestFor}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
