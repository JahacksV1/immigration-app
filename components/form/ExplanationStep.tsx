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

      <Textarea
        label="What would you like to explain in this letter?"
        placeholder="Describe the situation, event, or circumstances that need clarification in your immigration application..."
        rows={6}
        value={data.mainExplanation}
        onChange={(e) => onChange({ ...data, mainExplanation: e.target.value })}
        required
      />

      <Textarea
        label="Are there specific dates or events we should mention? (Optional)"
        placeholder="e.g., 'I was unemployed from January 2023 to March 2023' or 'I traveled to Canada in December 2022'"
        rows={3}
        value={data.dates || ''}
        onChange={(e) => onChange({ ...data, dates: e.target.value })}
      />

      <Textarea
        label="Any additional background or context? (Optional)"
        placeholder="Any other relevant information that would help explain your situation..."
        rows={3}
        value={data.background || ''}
        onChange={(e) => onChange({ ...data, background: e.target.value })}
      />
    </div>
  );
}
