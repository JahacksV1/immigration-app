import { useState, useEffect, useCallback } from 'react';
import { FormData } from '@/types/form';
import { STORAGE_KEYS } from '@/lib/constants';
import { logger } from '@/lib/logger';

const DEFAULT_FORM_DATA: FormData = {
  aboutYou: {
    fullName: '',
    citizenshipCountry: '',
    currentCountry: '',
  },
  applicationContext: {
    applicationType: '',
  },
  explanation: {
    mainExplanation: '',
    dates: '',
    background: '',
  },
  tone: 'neutral',
  template: 'professional',
  emphasis: '',
  contactInfo: {},
};

export type SaveStatus = 'idle' | 'saving' | 'saved';

interface UseFormPersistenceReturn {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
  clearFormData: () => void;
  isLoaded: boolean;
  saveStatus: SaveStatus;
}

/**
 * Hook for managing form data with localStorage persistence
 * Auto-saves on every change, hydrates on mount
 */
export function useFormPersistence(): UseFormPersistenceReturn {
  const [formData, setFormData] = useState<FormData>(DEFAULT_FORM_DATA);
  const [isLoaded, setIsLoaded] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FORM_DATA);
      if (saved) {
        const parsed = JSON.parse(saved) as FormData;
        setFormData(parsed);
        logger.info('Form data loaded from localStorage');
      }
    } catch (error) {
      logger.error('Failed to load form data', { error });
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Update and persist
  const updateFormData = useCallback((updates: Partial<FormData>) => {
    setSaveStatus('saving');
    
    setFormData((prev) => {
      const next = { ...prev, ...updates };
      try {
        localStorage.setItem(STORAGE_KEYS.FORM_DATA, JSON.stringify(next));
        logger.info('Form data saved');
      } catch (error) {
        logger.error('Failed to save form data', { error });
      }
      return next;
    });
    
    // Short delay to show "Saving..." state, then show "Saved"
    setTimeout(() => {
      setSaveStatus('saved');
    }, 300);
  }, []);

  // Clear form
  const clearFormData = useCallback(() => {
    setFormData(DEFAULT_FORM_DATA);
    try {
      localStorage.removeItem(STORAGE_KEYS.FORM_DATA);
      logger.info('Form data cleared');
    } catch (error) {
      logger.error('Failed to clear form data', { error });
    }
  }, []);

  return { formData, updateFormData, clearFormData, isLoaded, saveStatus };
}
