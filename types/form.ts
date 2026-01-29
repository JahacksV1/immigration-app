/**
 * Immigration Letter Form Type Definitions
 * Centralized types for form data and state management
 */

// Form step enumeration
export type FormStepId = 'about-you' | 'application-context' | 'explanation' | 'tone' | 'contact-details';

// Contact information structure (optional, not stored on backend)
export interface ContactInformation {
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  email?: string;
  phone?: string;
}

// Template/formatting style options
export type TemplateStyle = 'conservative' | 'modern' | 'professional';

// Form data structure (matches localStorage)
export interface FormData {
  aboutYou: {
    fullName: string;
    citizenshipCountry: string;
    currentCountry: string;
  };
  applicationContext: {
    applicationType: string;
  };
  explanation: {
    mainExplanation: string;
    dates?: string;
    background?: string;
  };
  tone: 'formal' | 'neutral' | 'personal';
  template: TemplateStyle;
  emphasis?: string;
  contactInfo?: ContactInformation;
}

// Form step state
export interface FormStepState {
  currentStep: FormStepId;
  completedSteps: FormStepId[];
  isValid: boolean;
}

// Country option
export interface CountryOption {
  value: string;
  label: string;
  code: string;
}

// Application type option
export interface ApplicationTypeOption {
  value: string;
  label: string;
  description?: string;
}
