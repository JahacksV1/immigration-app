import { Textarea } from '@/components/ui/Textarea';
import { Card } from '@/components/ui/Card';
import { FormData } from '@/types/form';
import { TONE_OPTIONS } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface ToneStepProps {
  data: {
    tone: FormData['tone'];
    emphasis?: FormData['emphasis'];
  };
  onChange: (data: { tone: FormData['tone']; emphasis?: string }) => void;
}

/**
 * Step 4: Tone & Emphasis
 * Selects writing style and optional emphasis points
 */
export function ToneStep({ data, onChange }: ToneStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-semibold text-foreground mb-2">
          Tone & Emphasis
        </h3>
        <p className="text-foreground-muted">
          Choose how you'd like your letter to sound
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-3">
          Letter Tone
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {TONE_OPTIONS.map((option) => (
            <Card
              key={option.value}
              hover
              padding="sm"
              className={cn(
                'cursor-pointer transition-all duration-200',
                data.tone === option.value
                  ? 'border-accent-purple bg-accent-purple/10 shadow-glow'
                  : 'border-border hover:border-accent-purple/50'
              )}
              onClick={() => onChange({ ...data, tone: option.value as FormData['tone'] })}
            >
              <div className="p-2">
                <h4 className="font-medium text-foreground mb-1">
                  {option.label}
                </h4>
                <p className="text-sm text-foreground-muted">
                  {option.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Textarea
        label="Anything you want emphasized? (Optional)"
        placeholder="e.g., 'I want to emphasize my commitment to following all immigration rules' or 'Please highlight my family ties to the country'"
        rows={3}
        value={data.emphasis || ''}
        onChange={(e) => onChange({ ...data, emphasis: e.target.value })}
      />
    </div>
  );
}
