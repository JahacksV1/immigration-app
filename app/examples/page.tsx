'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Tabs } from '@/components/ui/Tabs';
import { Button } from '@/components/ui/Button';
import { LetterPreview } from '@/components/examples/LetterPreview';
import { findExampleLetter } from '@/lib/example-letters';
import { TEMPLATE_OPTIONS, TONE_OPTIONS } from '@/lib/constants';
import type { TemplateStyle } from '@/types/form';
import type { ToneStyle, TabItem } from '@/types/example';

/**
 * Examples Page
 *
 * Showcases all 9 template/tone combinations with a tabbed interface.
 * Helps users understand template and tone differences before starting.
 *
 * Features:
 * - Tabbed template selection
 * - Tabbed tone selection
 * - Live letter preview
 * - "Best for" guidance
 * - Mobile responsive
 * - Full accessibility (ARIA, keyboard nav)
 */
export default function ExamplesPage() {
  // State for selected template and tone
  const [selectedTemplate, setSelectedTemplate] =
    useState<TemplateStyle>('conservative');
  const [selectedTone, setSelectedTone] = useState<ToneStyle>('formal');

  // Find the current letter based on selections
  const currentLetter = findExampleLetter(selectedTemplate, selectedTone);

  // Convert template options to TabItem format
  const templateTabs: TabItem[] = TEMPLATE_OPTIONS.map((opt) => ({
    value: opt.value,
    label: opt.label,
    description: opt.description,
  }));

  // Convert tone options to TabItem format
  const toneTabs: TabItem[] = TONE_OPTIONS.map((opt) => ({
    value: opt.value,
    label: opt.label,
    description: opt.description,
  }));

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="border-b border-border bg-card/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="space-y-4">
            {/* Breadcrumb */}
            <Link
              href="/"
              className="inline-flex items-center text-sm text-foreground-muted hover:text-foreground transition-colors"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                strokeWidth="2"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to home
            </Link>

            {/* Page Title */}
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
                Example Letters
              </h1>
              <p className="text-lg text-foreground-muted max-w-2xl">
                Explore different template and tone combinations to see which
                style fits your needs. All examples use the same scenario to
                help you compare approaches.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="space-y-8">
          {/* Template Selection */}
          <div className="space-y-3">
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Choose Template Style
              </h2>
              <p className="text-sm text-foreground-muted mt-1">
                Templates control formatting, paragraph structure, and visual
                layout
              </p>
            </div>
            <Tabs
              items={templateTabs}
              value={selectedTemplate}
              onValueChange={(value) =>
                setSelectedTemplate(value as TemplateStyle)
              }
              ariaLabel="Template style selection"
            />
          </div>

          {/* Tone Selection */}
          <div className="space-y-3">
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Choose Tone
              </h2>
              <p className="text-sm text-foreground-muted mt-1">
                Tone controls language style, formality level, and voice
              </p>
            </div>
            <Tabs
              items={toneTabs}
              value={selectedTone}
              onValueChange={(value) => setSelectedTone(value as ToneStyle)}
              ariaLabel="Tone selection"
            />
          </div>

          {/* Letter Preview */}
          <div className="pt-4">
            {currentLetter ? (
              <LetterPreview letter={currentLetter} showMetadata={true} />
            ) : (
              <div className="text-center py-12 text-foreground-muted">
                <p>No example letter found for this combination.</p>
              </div>
            )}
          </div>

          {/* CTA Section */}
          <div className="border-t border-border pt-8 mt-12">
            <div className="bg-gradient-to-br from-accent-purple/10 to-accent-purple/5 border border-accent-purple/20 rounded-lg p-6 sm:p-8">
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-foreground">
                    Ready to create your letter?
                  </h3>
                  <p className="text-sm text-foreground-muted mt-2">
                    Use the{' '}
                    <span className="font-medium text-foreground capitalize">
                      {selectedTemplate}
                    </span>{' '}
                    template with a{' '}
                    <span className="font-medium text-foreground capitalize">
                      {selectedTone}
                    </span>{' '}
                    tone, or choose any combination that fits your needs.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => (window.location.href = '/start')}
                    className="sm:w-auto w-full"
                  >
                    Start My Letter
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => (window.location.href = '/')}
                    className="sm:w-auto w-full"
                  >
                    Learn More
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer spacing */}
      <div className="h-12" />
    </div>
  );
}
