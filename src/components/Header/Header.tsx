import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { Logo } from './Logo';
import { Navigation } from './Navigation';
import { HeaderControls } from './HeaderControls';
import './Header.css';

interface HeaderProps {
  isScrolled: boolean;
  isHeaderTransparent: boolean;
  isMobileMenuOpen: boolean;
  onMobileMenuToggle: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onNavClick: (href: string) => void;
}

export function Header({
  isScrolled,
  isHeaderTransparent,
  isMobileMenuOpen,
  onMobileMenuToggle,
  onMouseEnter,
  onMouseLeave,
  onNavClick
}: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();

  return (
    <header 
      className={`header ${isScrolled ? 'scrolled' : ''} ${isHeaderTransparent ? 'transparent' : ''}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="header-content container">
        <Logo />
        <div className="header-right">
          <Navigation onNavClick={onNavClick} />
          <HeaderControls
            theme={theme}
            language={language}
            isMobileMenuOpen={isMobileMenuOpen}
            onThemeToggle={toggleTheme}
            onLanguageToggle={toggleLanguage}
            onMobileMenuToggle={onMobileMenuToggle}
          />
        </div>
      </div>
    </header>
  );
}