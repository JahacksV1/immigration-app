import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
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
        value={data.fullName}
        onChange={(e) => onChange({ ...data, fullName: e.target.value })}
        required
      />

      <Select
        label="Country of Citizenship"
        placeholder="Select your country of citizenship"
        value={data.citizenshipCountry}
        onChange={(e) => onChange({ ...data, citizenshipCountry: e.target.value })}
        options={COUNTRIES.map(c => ({ value: c.value, label: c.label }))}
        required
      />

      <Select
        label="Current Country of Residence"
        placeholder="Select where you currently live"
        value={data.currentCountry}
        onChange={(e) => onChange({ ...data, currentCountry: e.target.value })}
        options={COUNTRIES.map(c => ({ value: c.value, label: c.label }))}
        required
      />
    </div>
  );
}
