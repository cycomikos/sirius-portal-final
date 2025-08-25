
import { Theme } from '../../context/ThemeContext';
import { Language } from '../../constants/translations';

interface HeaderControlsProps {
  theme: Theme;
  language: Language;
  isMobileMenuOpen: boolean;
  onThemeToggle: () => void;
  onLanguageToggle: () => void;
  onMobileMenuToggle: () => void;
}

export function HeaderControls({
  theme,
  language,
  isMobileMenuOpen,
  onThemeToggle,
  onLanguageToggle,
  onMobileMenuToggle
}: HeaderControlsProps) {
  return (
    <div className="header-controls">
      <div className="desktop-controls">
        <button 
          className="theme-toggle"
          onClick={onThemeToggle}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
        <button 
          className="language-toggle"
          onClick={onLanguageToggle} 
        >
          {language === 'en' ? 'BM' : 'EN'}
        </button>
      </div>
      <button 
        className={`mobile-menu-btn ${isMobileMenuOpen ? 'active' : ''}`}
        onClick={onMobileMenuToggle}
        aria-label="Toggle mobile menu"
      >
        <div className="hamburger">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </button>
    </div>
  );
}