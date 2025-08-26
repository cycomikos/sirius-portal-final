import { useTranslation } from 'react-i18next';
import { useLanguage } from '../context/LanguageContext';
import { useI18nSync } from './useI18nSync';

/**
 * Transition hook that provides both old and new translation methods
 * This allows for gradual migration from custom context to react-i18next
 */
export function useI18nTransition() {
  const { t: i18nT } = useTranslation();
  const { t: legacyT, language, toggleLanguage, setLanguage } = useLanguage();
  
  // Sync react-i18next with existing language context
  useI18nSync();
  
  return {
    // New react-i18next translation function
    t: i18nT,
    
    // Legacy translation object (for components not yet migrated)
    legacyT,
    
    // Language management
    language,
    toggleLanguage,
    setLanguage,
    
    // Helper function to safely get translations from either method
    getText: (key: string, fallbackKey?: keyof typeof legacyT) => {
      try {
        const translation = i18nT(key);
        // If translation is the same as key, it means the key wasn't found
        return translation !== key ? translation : (fallbackKey ? legacyT[fallbackKey] : key);
      } catch {
        return fallbackKey ? legacyT[fallbackKey] : key;
      }
    }
  };
}