// Type definitions for react-i18next
import 'react-i18next';
import type enTranslations from './locales/en.json';

declare module 'react-i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation';
    resources: {
      translation: typeof enTranslations;
    };
  }
}

export type SupportedLanguage = 'en' | 'ms';
export type TranslationKeys = keyof typeof enTranslations;