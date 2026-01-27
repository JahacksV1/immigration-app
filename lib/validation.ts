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
    targetCountry: z.string().min(1, 'Target country is required'),
  }),
  explanation: z.object({
    mainExplanation: z.string().min(50, 'Explanation must be at least 50 characters'),
    dates: z.string().optional(),
    background: z.string().optional(),
  }),
  tone: z.enum(['formal', 'neutral', 'personal']),
  emphasis: z.string().optional(),
});

export type ValidatedFormData = z.infer<typeof formDataSchema>;

// Generate letter request validation
export const generateLetterSchema = z.object({
  formData: formDataSchema,
});

// Stripe checkout request validation
export const createCheckoutSchema = z.object({
  documentId: z.string().startsWith('doc_').min(20, 'Invalid document ID'),
});
