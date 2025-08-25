import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { NavClickHandler } from '../../types';
import { Logo } from '../UI';
import './Footer.css';

interface FooterProps {
  onNavClick?: NavClickHandler;
}

export function Footer({ onNavClick }: FooterProps) {
  const { t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const handleNavClick = (href: string) => {
    if (onNavClick) {
      onNavClick(href);
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          {/* Brand Section */}
          <div className="footer-brand">
            <div className="footer-logo">
              <Logo variant="full" size="medium" className="footer-logo-component" />
            </div>
            <p className="footer-description">{t.footerDescription}</p>
            <div className="footer-social">
              <button 
                className="social-link" 
                onClick={toggleTheme}
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? '☀️' : '🌙'}
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h3 className="footer-section-title">{t.quickLinks}</h3>
            <ul className="footer-links">
              <li>
                <button 
                  className="footer-link"
                  onClick={() => handleNavClick('#home')}
                >
                  {t.home}
                </button>
              </li>
              <li>
                <button 
                  className="footer-link"
                  onClick={() => handleNavClick('#about')}
                >
                  {t.sirius}
                </button>
              </li>
              <li>
                <button 
                  className="footer-link"
                  onClick={() => handleNavClick('#integrate')}
                >
                  {t.integration}
                </button>
              </li>
              <li>
                <button 
                  className="footer-link"
                  onClick={() => handleNavClick('#promotions')}
                >
                  {t.promotion}
                </button>
              </li>
              <li>
                <button 
                  className="footer-link"
                  onClick={() => handleNavClick('#contact')}
                >
                  {t.contact}
                </button>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="footer-section">
            <h3 className="footer-section-title">{t.resources}</h3>
            <ul className="footer-links">
              <li>
                <a href="#" className="footer-link">Documentation</a>
              </li>
              <li>
                <a href="#" className="footer-link">API Reference</a>
              </li>
              <li>
                <a href="#" className="footer-link">User Guide</a>
              </li>
              <li>
                <a href="#" className="footer-link">Training Materials</a>
              </li>
              <li>
                <a href="#" className="footer-link">Support Center</a>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div className="footer-section">
            <h3 className="footer-section-title">{t.connect}</h3>
            <ul className="footer-links">
              <li>
                <a 
                  href="mailto:gis.support@petronas.com.my" 
                  className="footer-link"
                >
                  📧 GIS Support
                </a>
              </li>
              <li>
                <a 
                  href="tel:+60388881000" 
                  className="footer-link"
                >
                  📞 +60 3-8888 1000
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  💬 Live Chat
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  📍 Office Locations
                </a>
              </li>
              <li>
                <button 
                  className="footer-link"
                  onClick={() => handleNavClick('#contact')}
                >
                  ✉️ Contact Form
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p className="copyright">
              © {currentYear} {t.copyright}
            </p>
            <div className="footer-bottom-links">
              <a href="#" className="footer-bottom-link">Privacy Policy</a>
              <a href="#" className="footer-bottom-link">Terms of Service</a>
              <a href="#" className="footer-bottom-link">Security</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}