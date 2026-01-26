/**
 * Document generation types
 */

import { FormData } from './form';

// Document section structure
export interface DocumentSection {
  heading: string;
  content: string;
}

// Generated document
export interface GeneratedDocument {
  sections: DocumentSection[];
  rawText: string;
  generatedAt: string;
}

// API request/response types
export interface GenerateLetterInput {
  formData: FormData;
}

export interface GenerateLetterResponse {
  success: boolean;
  document?: GeneratedDocument;
  error?: string;
}

// Document storage
export interface StoredDocument extends GeneratedDocument {
  formData: FormData;
  isPaid: boolean;
}
