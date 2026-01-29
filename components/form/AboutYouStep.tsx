import { Input } from '@/components/ui/Input';
import { SearchableSelect } from '@/components/ui/SearchableSelect';
import { FormData } from '@/types/form';
import { COUNTRIES } from '@/lib/constants';

interface AboutYouStepProps {
  data: FormData['aboutYou'];
  onChange: (data: FormData['aboutYou']) => void;
}

/**
 * Step 1: About You
 * Collects basic personal information
 */
export function AboutYouStep({ data, onChange }: AboutYouStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-semibold text-foreground mb-2">
          About You
        </h3>
        <p className="text-foreground-muted">
          Tell us a bit about yourself
        </p>
      </div>

      <Input
        label="Full Name"
        placeholder="John Doe"
        tooltip="Enter your full legal name as it appears on your passport or official documents. This personalizes your letter."
        value={data.fullName}
        onChange={(e) => onChange({ ...data, fullName: e.target.value })}
        required
      />

      <SearchableSelect
        label="Country of Citizenship"
        placeholder="Type to search countries..."
        tooltip="Your country of citizenship helps us understand your immigration context and tailor the letter accordingly."
        value={data.citizenshipCountry}
        onChange={(value) => onChange({ ...data, citizenshipCountry: value })}
        options={COUNTRIES.map(c => ({ value: c.value, label: c.label }))}
        required
      />

      <SearchableSelect
        label="Current Country of Residence"
        placeholder="Type to search countries..."
        tooltip="Where you currently live. This provides important context for your immigration application."
        value={data.currentCountry}
        onChange={(value) => onChange({ ...data, currentCountry: value })}
        options={COUNTRIES.map(c => ({ value: c.value, label: c.label }))}
        required
      />
    </div>
  );
}
