import { useState, useCallback } from 'react';
import { FormStepId } from '@/types/form';

const STEP_ORDER: FormStepId[] = [
  'about-you',
  'application-context',
  'explanation',
  'tone',
];

interface UseFormStepReturn {
  currentStep: number;
  currentStepId: FormStepId;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
  isLastStep: boolean;
  totalSteps: number;
}

/**
 * Hook for managing multi-step form navigation
 */
export function useFormStep(): UseFormStepReturn {
  const [currentStep, setCurrentStep] = useState(0);

  const goToNextStep = useCallback(() => {
    if (currentStep < STEP_ORDER.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  }, [currentStep]);

  const goToPreviousStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  return {
    currentStep,
    currentStepId: STEP_ORDER[currentStep],
    goToNextStep,
    goToPreviousStep,
    canGoNext: currentStep < STEP_ORDER.length - 1,
    canGoPrevious: currentStep > 0,
    isLastStep: currentStep === STEP_ORDER.length - 1,
    totalSteps: STEP_ORDER.length,
  };
}
