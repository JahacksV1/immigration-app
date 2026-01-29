'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { SavedIndicator } from '@/components/ui/SavedIndicator';
import { ProgressBar } from '@/components/form/ProgressBar';
import { FormNavigation } from '@/components/form/FormNavigation';
import { AboutYouStep } from '@/components/form/AboutYouStep';
import { ApplicationContextStep } from '@/components/form/ApplicationContextStep';
import { ExplanationStep } from '@/components/form/ExplanationStep';
import { ToneStep } from '@/components/form/ToneStep';
import { ContactDetailsStep } from '@/components/form/ContactDetailsStep';
import { useFormStep } from '@/hooks/useFormStep';
import { useFormPersistence } from '@/hooks/useFormPersistence';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { logger } from '@/lib/logger';

const STEP_NAMES = ['About You', 'Application', 'Explanation', 'Tone', 'Contact Info'];

/**
 * Multi-step form page
 * Collects user information for letter generation
 */
export default function StartPage() {
  const router = useRouter();
  const { currentStep, currentStepId, goToNextStep, goToPreviousStep, totalSteps } = useFormStep();
  const { formData, updateFormData, isLoaded, saveStatus } = useFormPersistence();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate current step
  const canProceed = (() => {
    switch (currentStepId) {
      case 'about-you':
        return (
          formData.aboutYou.fullName.trim().length > 0 &&
          formData.aboutYou.citizenshipCountry.length > 0 &&
          formData.aboutYou.currentCountry.length > 0
        );
      case 'application-context':
        return formData.applicationContext.applicationType.length > 0;
      case 'explanation':
        return formData.explanation.mainExplanation.trim().length >= 50;
      case 'tone':
        return formData.tone.length > 0;
      case 'contact-details':
        return true; // Optional step - always allow proceed
      default:
        return false;
    }
  })();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // LOG EXACT DATA BEING SENT
      logger.info('=== FORM SUBMISSION DEBUG ===');
      logger.info('Full formData being sent:', {
        aboutYou: formData.aboutYou,
        applicationContext: formData.applicationContext,
        explanation: formData.explanation,
        tone: formData.tone,
        emphasis: formData.emphasis,
      });
      logger.info('Submitting form to generate letter');

      // Call generation API
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ formData }),
      });

      const result = await response.json();

      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to generate letter');
      }

      const { documentId, document } = result.data;

      // LOG WHAT WE RECEIVED FROM API
      logger.info('=== API RESPONSE DEBUG ===');
      logger.info('Received from API:', {
        documentId,
        hasDocument: !!document,
        hasSections: !!document?.sections,
        sectionsCount: document?.sections?.length,
        hasRawText: !!document?.rawText,
        rawTextLength: document?.rawText?.length,
      });

      // Store document ID and document in localStorage for preview page
      localStorage.setItem('current-document-id', documentId);
      localStorage.setItem(`document-${documentId}`, JSON.stringify(document));
      
      // VERIFY IT WAS STORED
      const stored = localStorage.getItem(`document-${documentId}`);
      logger.info('=== LOCALSTORAGE DEBUG ===');
      logger.info('Document stored in localStorage:', {
        documentId,
        stored: !!stored,
        storedLength: stored?.length,
      });

      logger.info('Letter generated successfully', { documentId });

      // Redirect to preview
      router.push('/preview');
    } catch (error) {
      logger.error('Form submission failed', { error });
      alert('Failed to generate letter. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground-muted">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* AI Generation Overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-card border border-accent-purple/30 rounded-lg p-8 shadow-glow max-w-md mx-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-accent-purple/20 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-accent-purple border-t-transparent rounded-full animate-spin" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Generating Your Letter</h3>
                <p className="text-sm text-foreground-muted">This takes 10-15 seconds...</p>
              </div>
            </div>
            <p className="text-sm text-foreground-muted">
              Our AI is drafting a professional Letter of Explanation based on your information.
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="border-b border-border bg-background-elevated sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
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
          
          {/* Saved Indicator */}
          <SavedIndicator status={saveStatus} />
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Progress Bar */}
        <div className="mb-12">
          <ProgressBar
            currentStep={currentStep}
            totalSteps={totalSteps}
            steps={STEP_NAMES}
          />
        </div>

        {/* Form Card */}
        <Card className="mb-8">
          <CardContent className="py-8">
            {/* Step Content */}
            {currentStepId === 'about-you' && (
              <AboutYouStep
                data={formData.aboutYou}
                onChange={(data) => updateFormData({ aboutYou: data })}
              />
            )}

            {currentStepId === 'application-context' && (
              <ApplicationContextStep
                data={formData.applicationContext}
                onChange={(data) => updateFormData({ applicationContext: data })}
              />
            )}

            {currentStepId === 'explanation' && (
              <ExplanationStep
                data={formData.explanation}
                onChange={(data) => updateFormData({ explanation: data })}
              />
            )}

            {currentStepId === 'tone' && (
              <ToneStep
                data={{ tone: formData.tone, template: formData.template, emphasis: formData.emphasis }}
                onChange={(data) => updateFormData({ tone: data.tone, template: data.template, emphasis: data.emphasis })}
              />
            )}

            {currentStepId === 'contact-details' && (
              <ContactDetailsStep
                data={formData.contactInfo || {}}
                onChange={(data) => updateFormData({ contactInfo: data })}
                onSkip={goToNextStep}
              />
            )}

            {/* Navigation */}
            <FormNavigation
              currentStep={currentStep}
              totalSteps={totalSteps}
              onPrevious={goToPreviousStep}
              onNext={goToNextStep}
              onSubmit={handleSubmit}
              canProceed={canProceed}
              isLoading={isSubmitting}
            />
          </CardContent>
        </Card>

        {/* Privacy Notice */}
        <p className="text-center text-sm text-foreground-muted">
          Your data is stored locally on your device. We don't save it on our servers.
        </p>
      </div>
    </div>
  );
}
