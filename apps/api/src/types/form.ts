export type FormStepId = 'about-you' | 'application-context' | 'explanation' | 'tone' | 'contact-details';

export interface ContactInformation {
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  email?: string;
  phone?: string;
}

export type TemplateStyle = 'conservative' | 'modern' | 'professional';

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
