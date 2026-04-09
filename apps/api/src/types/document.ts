import { FormData } from './form';

export interface DocumentSection {
  heading: string;
  content: string;
}

export interface GeneratedDocument {
  sections: DocumentSection[];
  rawText: string;
  generatedAt: string;
}

export interface GenerateLetterInput {
  formData: FormData;
}

export interface GenerateLetterResponse {
  success: boolean;
  document?: GeneratedDocument;
  error?: string;
}

export interface StoredDocument extends GeneratedDocument {
  formData: FormData;
  isPaid: boolean;
}
