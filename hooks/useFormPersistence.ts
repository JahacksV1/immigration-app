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
    targetCountry: '',
  },
  explanation: {
    mainExplanation: '',
    dates: '',
    background: '',
  },
  tone: 'neutral',
  emphasis: '',
};

interface UseFormPersistenceReturn {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
  clearFormData: () => void;
  isLoaded: boolean;
}

/**
 * Hook for managing form data with localStorage persistence
 * Auto-saves on every change, hydrates on mount
 */
export function useFormPersistence(): UseFormPersistenceReturn {
  const [formData, setFormData] = useState<FormData>(DEFAULT_FORM_DATA);
  const [isLoaded, setIsLoaded] = useState(false);

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

  return { formData, updateFormData, clearFormData, isLoaded };
}
