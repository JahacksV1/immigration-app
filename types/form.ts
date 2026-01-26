/**
 * Immigration Letter Form Type Definitions
 * Centralized types for form data and state management
 */

// Form step enumeration
export type FormStepId = 'about-you' | 'application-context' | 'explanation' | 'tone';

// Form data structure (matches localStorage)
export interface FormData {
  aboutYou: {
    fullName: string;
    citizenshipCountry: string;
    currentCountry: string;
  };
  applicationContext: {
    applicationType: string;
    targetCountry: string;
  };
  explanation: {
    mainExplanation: string;
    dates?: string;
    background?: string;
  };
  tone: 'formal' | 'neutral' | 'personal';
  emphasis?: string;
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
