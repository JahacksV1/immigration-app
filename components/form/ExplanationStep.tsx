import { Textarea } from '@/components/ui/Textarea';
import { FormData } from '@/types/form';

interface ExplanationStepProps {
  data: FormData['explanation'];
  onChange: (data: FormData['explanation']) => void;
}

/**
 * Step 3: What Needs Explaining
 * Collects the main content for the letter
 */
export function ExplanationStep({ data, onChange }: ExplanationStepProps) {
  const charCount = data.mainExplanation.length;
  const isValid = charCount >= 50;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-semibold text-foreground mb-2">
          What Needs to Be Explained
        </h3>
        <p className="text-foreground-muted">
          Tell us about the situation or event you need to explain
        </p>
      </div>

      <div>
        <Textarea
          label="What would you like to explain in this letter?"
          placeholder="Describe the situation, event, or circumstances that need clarification in your immigration application..."
          tooltip="Describe the main situation or circumstance that needs clarification in your application. Be specific and factual. Minimum 50 characters."
          rows={6}
          value={data.mainExplanation}
          onChange={(e) => onChange({ ...data, mainExplanation: e.target.value })}
          required
        />
        
        <div className="mt-2 flex items-center justify-between text-sm">
          <div className={`flex items-center gap-2 ${isValid ? 'text-green-500' : 'text-foreground-muted'}`}>
            {isValid && (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
            <span>
              {charCount} / 50 characters {isValid ? '' : 'minimum'}
            </span>
          </div>
        </div>
      </div>

      <Textarea
        label="Are there specific dates or events we should mention? (Optional)"
        placeholder="e.g., 'I was unemployed from January 2023 to March 2023' or 'I traveled to Canada in December 2022'"
        tooltip="Optional: Include any relevant dates, timelines, or specific events that provide context to your explanation."
        rows={3}
        value={data.dates || ''}
        onChange={(e) => onChange({ ...data, dates: e.target.value })}
      />

      <Textarea
        label="Any additional background or context? (Optional)"
        placeholder="Any other relevant information that would help explain your situation..."
        tooltip="Optional: Add any other relevant information that helps explain your situation more fully."
        rows={3}
        value={data.background || ''}
        onChange={(e) => onChange({ ...data, background: e.target.value })}
      />
    </div>
  );
}
