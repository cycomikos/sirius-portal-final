
import { useLanguage } from '../../context/LanguageContext';

interface NavigationProps {
  onNavClick: (href: string) => void;
}

export function Navigation({ onNavClick }: NavigationProps) {
  const { t } = useLanguage();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    onNavClick(href);
  };

  return (
    <nav className="nav-menu">
      <a href="#home" onClick={(e) => handleClick(e, '#home')}>{t.home}</a>
      <a href="#about" onClick={(e) => handleClick(e, '#about')}>{t.sirius}</a>
      <a href="#integrate" onClick={(e) => handleClick(e, '#integrate')}>{t.integration}</a>
      <a href="#promotions" onClick={(e) => handleClick(e, '#promotions')}>{t.promotion}</a>
      <a href="#contact" onClick={(e) => handleClick(e, '#contact')}>{t.contact}</a>
    </nav>
  );
}