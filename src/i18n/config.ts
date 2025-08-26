import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslations from './locales/en.json';
import msTranslations from './locales/ms.json';

// Configure i18next
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: process.env.NODE_ENV === 'development',
    
    // Language detection options
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
    
    // Fallback language
    fallbackLng: 'en',
    
    // Available languages
    supportedLngs: ['en', 'ms'],
    
    // Resources (translations)
    resources: {
      en: {
        translation: enTranslations,
      },
      ms: {
        translation: msTranslations,
      },
    },
    
    // React-i18next options
    react: {
      useSuspense: false,
      bindI18n: 'languageChanged',
      bindI18nStore: '',
      transEmptyNodeValue: '',
      transSupportBasicHtmlNodes: true,
      transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'em'],
    },
    
    // Interpolation options
    interpolation: {
      escapeValue: false, // React already does escaping
    },
    
    // Namespace options
    defaultNS: 'translation',
    ns: ['translation'],
  });

export default i18n;