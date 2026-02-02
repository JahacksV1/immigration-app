import { z } from 'zod';

/**
 * Validation schemas for API requests
 */

// Form data validation
export const formDataSchema = z.object({
  aboutYou: z.object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters'),
    citizenshipCountry: z.string().min(1, 'Citizenship country is required'),
    currentCountry: z.string().min(1, 'Current country is required'),
  }),
  applicationContext: z.object({
    applicationType: z.string().min(1, 'Application type is required'),
  }),
  explanation: z.object({
    mainExplanation: z.string().min(50, 'Explanation must be at least 50 characters'),
    dates: z.string().optional(),
    background: z.string().optional(),
  }),
  tone: z.enum(['formal', 'neutral', 'personal']),
  template: z.enum(['conservative', 'modern', 'professional']),
  emphasis: z.string().optional(),
  contactInfo: z.object({
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
  }).optional(),
});

export type ValidatedFormData = z.infer<typeof formDataSchema>;

// Generate letter request validation
export const generateLetterSchema = z.object({
  formData: formDataSchema,
});

// Stripe checkout request validation
export const createCheckoutSchema = z.object({
  documentId: z.string().startsWith('doc_').min(20, 'Invalid document ID'),
  email: z.string().email('Invalid email address').optional(),
});

// Send email request validation
export const sendEmailSchema = z.object({
  email: z.string().email('Valid email address required'),
  documentText: z.string().min(50, 'Document text too short'),
  applicantName: z.string().min(1, 'Applicant name required'),
});
