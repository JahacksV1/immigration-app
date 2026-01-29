import { Input } from '@/components/ui/Input';
import { ContactInformation } from '@/types/form';

interface ContactDetailsStepProps {
  data: ContactInformation;
  onChange: (data: ContactInformation) => void;
  onSkip?: () => void;
}

/**
 * Step 5: Contact Details (Optional)
 * Collects contact information to pre-fill letter header
 * NOT stored on backend - privacy first
 */
export function ContactDetailsStep({ data, onChange }: ContactDetailsStepProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-2xl font-semibold text-foreground mb-2">
          Contact Information (Optional)
        </h3>
        <p className="text-foreground-muted mb-4">
          Add your contact details to make your letter ready to send
        </p>
        
        {/* Privacy Notice */}
        <div className="bg-accent-purple/10 border border-accent-purple/20 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-accent-purple mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <div className="text-sm">
              <p className="font-semibold text-foreground mb-1">
                Your privacy is protected
              </p>
              <p className="text-foreground-muted">
                This information is NOT stored or collected. It only fills in your letter to save you time. You can skip this step and add it manually later.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Your Information */}
      <div>
        <h4 className="text-lg font-medium text-foreground mb-4">
          Your Information
        </h4>

        <div className="space-y-4">
          <Input
            label="Street Address"
            placeholder="123 Main Street, Apt 4B"
            tooltip="Your street address"
            value={data.address || ''}
            onChange={(e) => onChange({ ...data, address: e.target.value })}
            autoComplete="street-address"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="City"
              placeholder="New York"
              value={data.city || ''}
              onChange={(e) => onChange({ ...data, city: e.target.value })}
              autoComplete="address-level2"
            />

            <Input
              label="State"
              placeholder="NY"
              value={data.state || ''}
              onChange={(e) => onChange({ ...data, state: e.target.value })}
              autoComplete="address-level1"
            />

            <Input
              label="ZIP Code"
              placeholder="10001"
              value={data.zipCode || ''}
              onChange={(e) => onChange({ ...data, zipCode: e.target.value })}
              autoComplete="postal-code"
            />
          </div>

          <Input
            label="Email Address"
            type="email"
            placeholder="your.email@example.com"
            value={data.email || ''}
            onChange={(e) => onChange({ ...data, email: e.target.value })}
            autoComplete="email"
          />

          <Input
            label="Phone Number"
            type="tel"
            placeholder="(555) 123-4567"
            value={data.phone || ''}
            onChange={(e) => onChange({ ...data, phone: e.target.value })}
            autoComplete="tel"
          />
        </div>
      </div>

    </div>
  );
}
