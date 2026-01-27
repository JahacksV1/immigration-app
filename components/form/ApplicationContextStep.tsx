import { Select } from '@/components/ui/Select';
import { FormData } from '@/types/form';
import { APPLICATION_TYPES, COUNTRIES } from '@/lib/constants';

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

      <Select
        label="What are you applying for?"
        placeholder="Select application type"
        tooltip="Select the type of immigration application you're submitting. This helps us frame your letter appropriately."
        value={data.applicationType}
        onChange={(e) => onChange({ ...data, applicationType: e.target.value })}
        options={APPLICATION_TYPES.map(t => ({ value: t.value, label: t.label }))}
        required
      />

      <Select
        label="Which country's immigration process?"
        placeholder="Select target country"
        tooltip="The country where you're applying. Different countries have different expectations for explanation letters."
        value={data.targetCountry}
        onChange={(e) => onChange({ ...data, targetCountry: e.target.value })}
        options={COUNTRIES.map(c => ({ value: c.value, label: c.label }))}
        required
      />
    </div>
  );
}
