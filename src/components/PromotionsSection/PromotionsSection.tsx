
import { useLanguage } from '../../context/LanguageContext';
import './PromotionsSection.css';

export function PromotionsSection() {
  const { t } = useLanguage();

  return (
    <section className="promotions-section" id="promotions">
      <div className="container">
        <div className="section-header text-center">
          <h2 className="heading-2 text-gradient">{t.promotionsTitle}</h2>
          <p className="body-large">{t.promotionsDescription}</p>
        </div>
        
        <div className="promotions-grid">
          <div className="promotion-card card">
            <div className="promotion-badge">{t.newFeatures}</div>
            <h3 className="heading-4">{t.announcement1Title}</h3>
            <p className="body-medium">{t.announcement1Desc}</p>
            <ul className="feature-list">
              <li>{t.feature1}</li>
              <li>{t.feature2}</li>
              <li>{t.feature3}</li>
            </ul>
          </div>
          
          <div className="promotion-card card">
            <div className="promotion-badge">{t.upcomingEvents}</div>
            <h3 className="heading-4">{t.announcement2Title}</h3>
            <p className="body-medium">{t.announcement2Desc}</p>
            <button className="btn-primary">{t.registerNow}</button>
          </div>
          
          <div className="promotion-card card">
            <div className="promotion-badge">{t.latestUpdates}</div>
            <h3 className="heading-4">{t.announcement3Title}</h3>
            <p className="body-medium">{t.announcement3Desc}</p>
            <ul className="feature-list">
              <li>{t.highlight1}</li>
              <li>{t.highlight2}</li>
              <li>{t.highlight3}</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}