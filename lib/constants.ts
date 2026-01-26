/**
 * Application constants
 */

import { CountryOption, ApplicationTypeOption } from '@/types/form';

// Application metadata
export const APP_NAME = 'Immigration Letter Generator';
export const APP_DESCRIPTION = 'Generate professional immigration letters in minutes';
export const PAYMENT_AMOUNT = 49; // USD

// LocalStorage keys
export const STORAGE_KEYS = {
  FORM_DATA: 'immigration-form-data',
  DOCUMENT: 'immigration-document',
  CHECKOUT_SESSION: 'immigration-checkout-session',
} as const;

// Country options
export const COUNTRIES: CountryOption[] = [
  { value: 'US', label: 'United States', code: 'US' },
  { value: 'CA', label: 'Canada', code: 'CA' },
  { value: 'GB', label: 'United Kingdom', code: 'GB' },
  { value: 'AU', label: 'Australia', code: 'AU' },
  { value: 'NZ', label: 'New Zealand', code: 'NZ' },
  { value: 'DE', label: 'Germany', code: 'DE' },
  { value: 'FR', label: 'France', code: 'FR' },
  { value: 'ES', label: 'Spain', code: 'ES' },
  { value: 'IT', label: 'Italy', code: 'IT' },
  { value: 'NL', label: 'Netherlands', code: 'NL' },
  { value: 'SE', label: 'Sweden', code: 'SE' },
  { value: 'NO', label: 'Norway', code: 'NO' },
  { value: 'DK', label: 'Denmark', code: 'DK' },
  { value: 'FI', label: 'Finland', code: 'FI' },
  { value: 'IE', label: 'Ireland', code: 'IE' },
  { value: 'CH', label: 'Switzerland', code: 'CH' },
  { value: 'AT', label: 'Austria', code: 'AT' },
  { value: 'BE', label: 'Belgium', code: 'BE' },
  { value: 'PT', label: 'Portugal', code: 'PT' },
  { value: 'GR', label: 'Greece', code: 'GR' },
  // Add more as needed
];

// Application types
export const APPLICATION_TYPES: ApplicationTypeOption[] = [
  {
    value: 'visa',
    label: 'Visa Application',
    description: 'Tourist, work, or study visa',
  },
  {
    value: 'green-card',
    label: 'Green Card / Permanent Residency',
    description: 'Permanent resident application',
  },
  {
    value: 'citizenship',
    label: 'Citizenship / Naturalization',
    description: 'Citizenship application',
  },
  {
    value: 'work-permit',
    label: 'Work Permit',
    description: 'Employment authorization',
  },
  {
    value: 'study-permit',
    label: 'Study Permit',
    description: 'Student visa or permit',
  },
  {
    value: 'family-sponsorship',
    label: 'Family Sponsorship',
    description: 'Sponsor a family member',
  },
  {
    value: 'other',
    label: 'Other',
    description: 'Other immigration application',
  },
];

// Tone options
export const TONE_OPTIONS = [
  {
    value: 'formal',
    label: 'Formal',
    description: 'Professional and structured',
  },
  {
    value: 'neutral',
    label: 'Neutral',
    description: 'Balanced and clear',
  },
  {
    value: 'personal',
    label: 'Personal',
    description: 'Warm and authentic',
  },
] as const;
