import { Card } from '@/components/ui/Card';
import { Tooltip } from '@/components/ui/Tooltip';
import { FormData } from '@/types/form';
import { APPLICATION_TYPES } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface ApplicationContextStepProps {
  data: FormData['applicationContext'];
  onChange: (data: FormData['applicationContext']) => void;
}

/**
 * Step 2: Application Context
 * Collects information about the immigration application
 */
export function ApplicationContextStep({ data, onChange }: ApplicationContextStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-semibold text-foreground mb-2">
          Application Context
        </h3>
        <p className="text-foreground-muted">
          Tell us about your immigration application
        </p>
      </div>

      {/* Application Type Selection - Modern Card Grid */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-zinc-300 mb-3">
          <span>What are you applying for?</span>
          <Tooltip content="Select the type of immigration application you're submitting. This helps us frame your letter appropriately.">
            <svg
              className="w-4 h-4 text-foreground-muted hover:text-accent-purple transition-colors cursor-help"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </Tooltip>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {APPLICATION_TYPES.map((type) => (
            <Card
              key={type.value}
              hover
              padding="sm"
              className={cn(
                'cursor-pointer transition-all duration-200',
                data.applicationType === type.value
                  ? 'border-accent-purple bg-accent-purple/10 shadow-glow'
                  : 'border-border hover:border-accent-purple/50'
              )}
              onClick={() => onChange({ ...data, applicationType: type.value })}
            >
              <div className="p-2">
                <h4 className="font-medium text-foreground mb-1">
                  {type.label}
                </h4>
                {type.description && (
                  <p className="text-sm text-foreground-muted">
                    {type.description}
                  </p>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

    </div>
  );
}
