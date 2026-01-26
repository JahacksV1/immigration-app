'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { ProgressBar } from '@/components/form/ProgressBar';
import { FormNavigation } from '@/components/form/FormNavigation';
import { AboutYouStep } from '@/components/form/AboutYouStep';
import { ApplicationContextStep } from '@/components/form/ApplicationContextStep';
import { ExplanationStep } from '@/components/form/ExplanationStep';
import { ToneStep } from '@/components/form/ToneStep';
import { useFormStep } from '@/hooks/useFormStep';
import { useFormPersistence } from '@/hooks/useFormPersistence';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { logger } from '@/lib/logger';

const STEP_NAMES = ['About You', 'Application', 'Explanation', 'Tone'];

/**
 * Multi-step form page
 * Collects user information for letter generation
 */
export default function StartPage() {
  const router = useRouter();
  const { currentStep, currentStepId, goToNextStep, goToPreviousStep, isLastStep, totalSteps } = useFormStep();
  const { formData, updateFormData, isLoaded } = useFormPersistence();
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
        return (
          formData.applicationContext.applicationType.length > 0 &&
          formData.applicationContext.targetCountry.length > 0
        );
      case 'explanation':
        return formData.explanation.mainExplanation.trim().length >= 50;
      case 'tone':
        return formData.tone.length > 0;
      default:
        return false;
    }
  })();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
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

      const { documentId } = result.data;

      // Store document ID in localStorage for preview page
      localStorage.setItem('current-document-id', documentId);

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
      {/* Header */}
      <header className="border-b border-border bg-background-elevated">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Link href="/" className="text-xl font-semibold text-foreground hover:text-accent-purple transition-colors">
            Immigration Letter Generator
          </Link>
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
                data={{ tone: formData.tone, emphasis: formData.emphasis }}
                onChange={(data) => updateFormData({ tone: data.tone, emphasis: data.emphasis })}
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
