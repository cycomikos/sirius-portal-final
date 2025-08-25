# SIRIUS Portal - PETRONAS GIS Platform

A modern, scalable React application for PETRONAS' SIRIUS GIS platform with multilingual support and responsive design.

## 🏗️ Architecture

### Project Structure
```
src/
├── components/           # Reusable UI components
│   ├── UI/              # Shared UI components (Button, Section, etc.)
│   ├── Header/          # Navigation header components
│   ├── HeroSection/     # Landing section with stats
│   ├── AboutSection/    # Platform information
│   ├── ContactSection/  # Contact form
│   ├── Footer/          # Site footer with links and info
│   └── ErrorBoundary/   # Error handling
├── context/             # React Context providers
│   ├── ThemeContext     # Dark/Light theme management
│   └── LanguageContext  # English/Malay language support
├── hooks/               # Custom React hooks
│   ├── useAppState      # Application state management
│   ├── useForm          # Form handling with validation
│   └── useScrollEffects # Scroll behavior management
├── types/               # TypeScript type definitions
├── assets/              # Static assets
│   └── images/          # Image files (WebP, PNG, JPG, etc.)
├── constants/           # Application constants
│   └── translations     # Multilingual text content
└── styles/              # Global CSS and variables
    ├── variables.css    # CSS custom properties
    ├── components.css   # Shared component styles
    └── global.css       # Global styles and utilities
```

## 🚀 Features

- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Multilingual Support**: English and Bahasa Malaysia
- **Theme Switching**: Dark and light mode with smooth transitions
- **Type Safety**: Full TypeScript implementation
- **Modern Architecture**: Component composition with custom hooks
- **Error Boundaries**: Graceful error handling
- **Form Validation**: Custom form hook with loading states
- **Image Optimization**: WebP format with lazy loading and error handling
- **Performance Optimized**: Code splitting and optimized builds

## 🛠️ Technology Stack

- **React 18** - Modern React with hooks and context
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **ESLint** - Code quality and consistency
- **CSS3** - Modern CSS with custom properties
- **Calcite Components** - Esri's design system integration

## 📦 Scripts

```bash
# Development
npm run dev          # Start development server

# Production
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
```

## 🎨 Design System

### Color Palette
- **PETRONAS Green**: Primary brand color
- **PETRONAS Blue**: Secondary brand color
- **PETRONAS Orange**: Accent color
- **Dynamic Theming**: CSS custom properties for theme switching

### Component Architecture
- **Atomic Design**: Small, reusable components
- **Composition Pattern**: Components compose together cleanly
- **Props Interface**: Well-defined TypeScript interfaces
- **Accessibility**: WCAG compliant with proper ARIA labels

## 🌐 Internationalization

The application supports two languages:
- **English (en)**: Default language
- **Bahasa Malaysia (ms)**: Localized content

Language switching is handled by the `LanguageContext` with persistent state.

## 🔧 Development Guidelines

### Code Style
- Use functional components with hooks
- Implement proper TypeScript types
- Follow consistent naming conventions
- Write self-documenting code with JSDoc comments

### Component Guidelines
- Keep components focused and single-responsibility
- Use composition over inheritance
- Implement proper prop interfaces
- Handle loading and error states

### State Management
- Use React Context for global state
- Custom hooks for reusable stateful logic
- Local state for component-specific data

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🚦 Performance

- Lazy loading for sections
- Optimized bundle splitting
- CSS-in-JS avoided for better performance
- Image optimization ready

## 🔒 Security

- Input validation on forms
- XSS protection
- Safe HTML rendering
- Error boundary implementation

## 📖 Contributing

1. Follow the established project structure
2. Write TypeScript with proper types
3. Add proper documentation
4. Test responsive design
5. Ensure accessibility compliance

---

Built with ❤️ for PETRONAS Digital Innovation

## 🧑‍💻 Original Calcite Setup

This project uses Calcite Components for enhanced GIS functionality. The setup includes:

### Asset Configuration
```ts
import { setAssetPath } from "@esri/calcite-components/dist/components";
setAssetPath(window.location.href); // Local assets
```

### Component Imports
```tsx
import "@esri/calcite-components/dist/calcite/calcite.css";
import { CalciteButton, CalciteIcon } from "@esri/calcite-components-react";
```

### Build Configuration
The project uses `vite-plugin-static-copy` to copy Calcite assets during build.