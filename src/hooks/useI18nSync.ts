import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../context/LanguageContext';

/**
 * Hook to sync react-i18next with our existing language context
 * This allows for a gradual migration from custom context to react-i18next
 */
export function useI18nSync() {
  const { i18n } = useTranslation();
  const { language, setLanguage } = useLanguage();
  
  // Sync i18next language with our context
  useEffect(() => {
    if (i18n.language !== language) {
      i18n.changeLanguage(language);
    }
  }, [language, i18n]);
  
  // Listen for i18next language changes and update context
  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      if (lng !== language && (lng === 'en' || lng === 'ms')) {
        setLanguage(lng as 'en' | 'ms');
      }
    };
    
    i18n.on('languageChanged', handleLanguageChange);
    return () => i18n.off('languageChanged', handleLanguageChange);
  }, [i18n, language, setLanguage]);
}