import { Button } from '@/components/ui/Button';

interface FormNavigationProps {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit?: () => void;
  canProceed: boolean;
  isLoading?: boolean;
}

/**
 * Navigation buttons for multi-step form
 */
export function FormNavigation({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  onSubmit,
  canProceed,
  isLoading = false,
}: FormNavigationProps) {
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  const handleNext = () => {
    if (isLastStep && onSubmit) {
      onSubmit();
    } else {
      onNext();
    }
  };

  return (
    <div className="flex items-center justify-between pt-8 border-t border-border">
      {isFirstStep ? (
        <div />
      ) : (
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={isLoading}
        >
          Previous
        </Button>
      )}

      <Button
        variant="primary"
        onClick={handleNext}
        disabled={!canProceed || isLoading}
        isLoading={isLoading}
        className="ml-auto"
      >
        {isLastStep ? 'Generate Letter' : 'Continue'}
      </Button>
    </div>
  );
}
