import { cn } from '@/lib/utils';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  steps: string[];
}

/**
 * Progress indicator for multi-step form
 */
export function ProgressBar({ currentStep, totalSteps, steps }: ProgressBarProps) {
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="w-full">
      {/* Progress bar */}
      <div className="relative h-2 bg-border rounded-full overflow-hidden mb-8">
        <div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-accent-purple to-accent-purple-glow transition-all duration-500 ease-out shadow-glow"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Step indicators */}
      <div className="flex justify-between items-center">
        {steps.map((step, index) => (
          <div
            key={step}
            className="flex flex-col items-center gap-2 flex-1"
          >
            <div
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300',
                index <= currentStep
                  ? 'bg-accent-purple text-white shadow-glow'
                  : 'bg-card border border-border text-foreground-muted'
              )}
            >
              {index + 1}
            </div>
            <span
              className={cn(
                'text-xs font-medium transition-colors hidden sm:block',
                index <= currentStep
                  ? 'text-foreground'
                  : 'text-foreground-muted'
              )}
            >
              {step}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
