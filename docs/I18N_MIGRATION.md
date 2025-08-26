# React-i18next Migration Guide

This project has been partially migrated from a custom language context to `react-i18next` for better internationalization support.

## Current State

### ✅ Completed
- **react-i18next setup**: Installed and configured react-i18next with language detection
- **Translation files**: Created structured JSON translation files in `src/i18n/locales/`
- **Type safety**: Added TypeScript definitions for translation keys
- **AboutSection**: Migrated to use react-i18next
- **Sync mechanism**: Created hooks to sync react-i18next with existing language context

### 🔄 In Progress  
- **Gradual migration**: AboutSection demonstrates the new pattern
- **Backward compatibility**: Both systems work together during transition

### 📋 Remaining Components to Migrate
- Header/Navigation
- HeroSection
- ContactSection  
- PromotionsSection
- IntegrationSection
- Footer
- MobileMenu

## File Structure

```
src/
├── i18n/
│   ├── config.ts           # i18next configuration
│   ├── types.ts            # TypeScript definitions
│   ├── index.ts            # Export helper
│   └── locales/
│       ├── en.json         # English translations
│       └── ms.json         # Malay translations
├── hooks/
│   ├── useI18nSync.ts      # Syncs i18next with legacy context
│   └── useI18nTransition.ts # Helper for gradual migration
└── context/
    └── LanguageContext.tsx # Legacy context (to be phased out)
```

## Migration Pattern

### Before (Legacy)
```tsx
import { useLanguage } from '../../context/LanguageContext';

function Component() {
  const { t } = useLanguage();
  
  return <h1>{t.heroTitle}</h1>
}
```

### After (React-i18next)
```tsx
import { useTranslation } from 'react-i18next';
import { useI18nSync } from '../../hooks/useI18nSync';

function Component() {
  const { t } = useTranslation();
  useI18nSync(); // Syncs with legacy language switching
  
  return <h1>{t('hero.title')}</h1>
}
```

## Translation Key Structure

### Old Structure
```ts
t.heroTitle
t.aboutDescription
t.contactTitle
```

### New Structure (Namespaced)
```ts
t('hero.title')
t('about.description') 
t('contact.title')
```

### Available Namespaces
- `header.*` - Navigation items
- `hero.*` - Hero section content
- `about.*` - About section content
- `contact.*` - Contact form and info
- `promotions.*` - Promotions and announcements
- `features.*` - Feature descriptions
- `footer.*` - Footer content
- `stats.*` - Statistics labels

## Special Cases

### HTML Content
For translations with HTML markup:
```tsx
// Old way
<h1>{t.aboutTitle.split('GIS-Powered Platform')[0]}<span className="highlight">GIS-Powered Platform</span></h1>

// New way  
<h1 dangerouslySetInnerHTML={{
  __html: t('about.title')
    .replace('<highlight>', '<span class="highlight">')
    .replace('</highlight>', '</span>')
}}>
</h1>
```

### Dynamic Values
```tsx
// Use interpolation
t('contact.formSuccess', { name: userName })

// In JSON
"formSuccess": "Thank you {{name}}! Your message has been sent."
```

## Language Switching

Language switching continues to work through the existing `LanguageContext` thanks to the sync mechanism:

```tsx
const { toggleLanguage, language } = useLanguage();
// This automatically updates react-i18next as well
```

## Benefits of Migration

1. **Better TypeScript support** - Autocomplete for translation keys
2. **Industry standard** - Well-maintained library with extensive features
3. **Advanced features** - Pluralization, interpolation, namespaces
4. **Better performance** - Optimized loading and caching
5. **Development tools** - Browser extensions and debugging support

## Migration Steps for Remaining Components

1. Import `useTranslation` and `useI18nSync`
2. Replace `useLanguage` with `useTranslation`
3. Convert `t.key` to `t('namespace.key')` format
4. Update translation keys in JSON files if needed
5. Test language switching functionality
6. Remove unused imports

## Notes

- The legacy `LanguageContext` will be kept until all components are migrated
- Both translation methods work simultaneously during transition
- Language switching automatically syncs between both systems
- All existing functionality remains intact during migration