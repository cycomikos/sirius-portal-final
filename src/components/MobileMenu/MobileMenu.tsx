
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import './MobileMenu.css';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavClick: (href: string) => void;
}

export function MobileMenu({ isOpen, onClose, onNavClick }: MobileMenuProps) {
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    onNavClick(href);
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleThemeToggle = () => {
    toggleTheme();
    onClose();
  };

  const handleLanguageToggle = () => {
    toggleLanguage();
    onClose();
  };

  return (
    <nav 
      className={`mobile-menu ${isOpen ? 'active' : ''}`}
      onClick={handleBackdropClick}
    >
      <ul className="mobile-menu-list">
        <li>
          <a href="#home" onClick={(e) => handleNavClick(e, '#home')}>
            {t.home}
          </a>
        </li>
        <li>
          <a href="#about" onClick={(e) => handleNavClick(e, '#about')}>
            {t.sirius}
          </a>
        </li>
        <li>
          <a href="#integrate" onClick={(e) => handleNavClick(e, '#integrate')}>
            {t.integration}
          </a>
        </li>
        <li>
          <a href="#promotions" onClick={(e) => handleNavClick(e, '#promotions')}>
            {t.promotion}
          </a>
        </li>
        <li>
          <a href="#contact" onClick={(e) => handleNavClick(e, '#contact')}>
            {t.contact}
          </a>
        </li>
      </ul>
      
      <div className="mobile-menu-controls">
        <button className="theme-toggle" onClick={handleThemeToggle}>
          {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
        </button>
        <button className="language-toggle" onClick={handleLanguageToggle}>
          {language === 'en' ? 'BM' : 'EN'}
        </button>
      </div>
    </nav>
  );
}