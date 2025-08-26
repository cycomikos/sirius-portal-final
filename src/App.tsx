import { Header } from './components/Header/Header';
import { MobileMenu } from './components/MobileMenu/MobileMenu';
import { HeroSection } from './components/HeroSection/HeroSection';
import { AboutSection } from './components/AboutSection/AboutSection';
import { IntegrationSection } from './components/IntegrationSection/IntegrationSection';
import { PromotionsSection } from './components/PromotionsSection/PromotionsSection';
import { ContactSection } from './components/ContactSection/ContactSection';
import { Footer } from './components/Footer/Footer';
import { ErrorBoundary } from './components/ErrorBoundary/ErrorBoundary';
import { useAppState, useScrollEffects } from './hooks';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { I18nextProvider } from 'react-i18next';
import { i18n } from './i18n';
import './styles/global.css';
import './components/ErrorBoundary/ErrorBoundary.css';
import './components/Footer/Footer.css';

/**
 * Main application content component that handles the layout and navigation state
 */
function AppContent() {
  const {
    isScrolled,
    isHeaderTransparent,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    handleHeaderMouseEnter,
    handleHeaderMouseLeave,
    handleNavClick
  } = useAppState();

  useScrollEffects(isMobileMenuOpen);

  return (
    <div className="app">
      <Header
        isScrolled={isScrolled}
        isHeaderTransparent={isHeaderTransparent}
        isMobileMenuOpen={isMobileMenuOpen}
        onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        onMouseEnter={handleHeaderMouseEnter}
        onMouseLeave={handleHeaderMouseLeave}
        onNavClick={handleNavClick}
      />
      
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onNavClick={handleNavClick}
      />
      
      <main>
        <HeroSection onNavClick={handleNavClick} />
        <AboutSection />
        <IntegrationSection />
        <PromotionsSection />
        <ContactSection />
      </main>
      
      <Footer onNavClick={handleNavClick} />
    </div>
  );
}

/**
 * Root App component with providers and error boundary
 */
function App() {
  return (
    <ErrorBoundary>
      <I18nextProvider i18n={i18n}>
        <ThemeProvider>
          <LanguageProvider>
            <AppContent />
          </LanguageProvider>
        </ThemeProvider>
      </I18nextProvider>
    </ErrorBoundary>
  );
}

export default App;