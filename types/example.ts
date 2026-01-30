/**
 * Example Letter Type Definitions
 * 
 * Centralized types for example letters showcase page.
 * All components and data files import from here.
 */

// ============================================================================
// ENTITY TYPES (Core Data Models)
// ============================================================================

/**
 * Tone style for letter writing
 */
export type ToneStyle = 'formal' | 'neutral' | 'personal';

/**
 * Example letter data structure
 * Represents a pre-generated letter showcasing a specific template/tone combination
 */
export interface ExampleLetter {
  /** Template style (matches FormData.template) */
  template: 'conservative' | 'modern' | 'professional';
  
  /** Tone style */
  tone: ToneStyle;
  
  /** Display title (e.g., "Conservative + Formal") */
  title: string;
  
  /** Short description of this combination */
  description: string;
  
  /** Guidance on when to use this combination */
  bestFor: string;
  
  /** Full letter text (500-700 words) */
  letterText: string;
  
  /** Word count metadata */
  wordCount: number;
  
  /** Paragraph count metadata */
  paragraphCount: number;
}

// ============================================================================
// UI COMPONENT TYPES
// ============================================================================

/**
 * Tab item for generic Tabs component
 */
export interface TabItem {
  /** Unique value identifier */
  value: string;
  
  /** Display label */
  label: string;
  
  /** Optional description text */
  description?: string;
  
  /** Optional icon element */
  icon?: React.ReactNode;
}

/**
 * Props for LetterPreview component
 */
export interface LetterPreviewProps {
  /** Letter to display */
  letter: ExampleLetter;
  
  /** Whether to show metadata (word count, etc.) */
  showMetadata?: boolean;
}
