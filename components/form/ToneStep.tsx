import { Textarea } from '@/components/ui/Textarea';
import { Card } from '@/components/ui/Card';
import { Tooltip } from '@/components/ui/Tooltip';
import { FormData, TemplateStyle } from '@/types/form';
import { TONE_OPTIONS } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface ToneStepProps {
  data: {
    tone: FormData['tone'];
    template: TemplateStyle;
    emphasis?: FormData['emphasis'];
  };
  onChange: (data: { tone: FormData['tone']; template: TemplateStyle; emphasis?: string }) => void;
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

      {/* Letter Tone Selection */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-zinc-300 mb-3">
          <span>Letter Tone</span>
          <Tooltip content="Choose the writing style that best fits your situation. Formal is more structured, Personal is warmer, Neutral is balanced.">
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

      {/* Professional Template Selection */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-zinc-300 mb-3">
          <span>Formatting Template</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Conservative Template */}
          <Card
            hover
            padding="sm"
            className={cn(
              'cursor-pointer transition-all duration-200',
              data.template === 'conservative'
                ? 'border-accent-purple bg-accent-purple/10 shadow-glow'
                : 'border-border hover:border-accent-purple/50'
            )}
            onClick={() => onChange({ ...data, template: 'conservative' })}
          >
            <div className="p-2">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium text-foreground">Conservative</h4>
                <Tooltip content="Traditional legal letter: Dense paragraphs (5-7 sentences), formal language, minimal spacing, structured format. Best for official government submissions.">
                  <svg className="w-4 h-4 text-foreground-muted hover:text-accent-purple transition-colors cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </Tooltip>
              </div>
              <p className="text-sm text-foreground-muted">Traditional legal formatting</p>
            </div>
          </Card>

          {/* Modern Template */}
          <Card
            hover
            padding="sm"
            className={cn(
              'cursor-pointer transition-all duration-200',
              data.template === 'modern'
                ? 'border-accent-purple bg-accent-purple/10 shadow-glow'
                : 'border-border hover:border-accent-purple/50'
            )}
            onClick={() => onChange({ ...data, template: 'modern' })}
          >
            <div className="p-2">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium text-foreground">Modern</h4>
                <Tooltip content="Contemporary style: Short paragraphs (2-3 sentences), clear breaks, generous spacing, scannable. Best for younger applicants or tech industry.">
                  <svg className="w-4 h-4 text-foreground-muted hover:text-accent-purple transition-colors cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </Tooltip>
              </div>
              <p className="text-sm text-foreground-muted">Clean contemporary style</p>
            </div>
          </Card>

          {/* Professional Template */}
          <Card
            hover
            padding="sm"
            className={cn(
              'cursor-pointer transition-all duration-200',
              data.template === 'professional'
                ? 'border-accent-purple bg-accent-purple/10 shadow-glow'
                : 'border-border hover:border-accent-purple/50'
            )}
            onClick={() => onChange({ ...data, template: 'professional' })}
          >
            <div className="p-2">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium text-foreground">Professional</h4>
                <Tooltip content="Executive format: Medium paragraphs (3-4 sentences), confident tone, strategic organization, polished language. Best for business professionals.">
                  <svg className="w-4 h-4 text-foreground-muted hover:text-accent-purple transition-colors cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </Tooltip>
              </div>
              <p className="text-sm text-foreground-muted">Executive business format</p>
            </div>
          </Card>
        </div>
      </div>

      <Textarea
        label="Anything you want emphasized? (Optional)"
        placeholder="e.g., 'I want to emphasize my commitment to following all immigration rules' or 'Please highlight my family ties to the country'"
        tooltip="Optional: Tell us what points you want to highlight or emphasize in your letter. This helps focus the content."
        rows={3}
        value={data.emphasis || ''}
        onChange={(e) => onChange({ ...data, emphasis: e.target.value })}
      />
    </div>
  );
}
