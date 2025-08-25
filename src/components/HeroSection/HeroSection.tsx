
import { useLanguage } from '../../context/LanguageContext';
import { NavClickHandler } from '../../types';
import heroImage from '../../assets/images/image-hero-besar.webp';
import './HeroSection.css';

interface HeroSectionProps {
  onNavClick: NavClickHandler;
}

export function HeroSection({ onNavClick }: HeroSectionProps) {
  const { t } = useLanguage();

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    onNavClick(href);
  };

  return (
    <section className="hero" id="home">
      <div className="hero-content">
        <div className="hero-text">
          <div className="hero-badge">
            <span>📍</span>
            {t.welcomeTo} <span style={{ color: '#FFD700' }}>SIRIUS</span>
          </div>
          <h1 className="hero-title heading-1">{t.heroTitle}</h1>
          <p className="hero-description body-large">{t.heroDescription}</p>
          <div className="hero-cta">
            <a 
              href="#about" 
              className="btn-primary" 
              onClick={(e) => handleNavClick(e, '#about')}
            >
              {t.exploreSirius}
              <span>→</span>
            </a>
            <a 
              href="#integrate" 
              className="btn-secondary" 
              onClick={(e) => handleNavClick(e, '#integrate')}
            >
              {t.learnMore}
              <span>📖</span>
            </a>
          </div>
        </div>
        
        <div className="hero-visual">
          <div className="hero-circles">
            <div className="circle-container circle-large">
              <img 
                src={heroImage} 
                alt="PETRONAS SIRIUS Platform - GIS Operations"
                className="circle-img"
                loading="eager"
              />
            </div>
            <div className="circle-container circle-small circle-1">
              <div className="circle-content">
                <span className="circle-icon">🌍</span>
              </div>
            </div>
            <div className="circle-container circle-small circle-2">
              <div className="circle-content">
                <span className="circle-icon">📊</span>
              </div>
            </div>
            <div className="circle-container circle-small circle-3">
              <div className="circle-content">
                <span className="circle-icon">🛰️</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}