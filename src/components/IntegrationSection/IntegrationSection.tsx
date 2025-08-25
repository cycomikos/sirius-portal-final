
import { useLanguage } from '../../context/LanguageContext';
import './IntegrationSection.css';

export function IntegrationSection() {
  const { t } = useLanguage();

  return (
    <section className="integration-section" id="integrate">
      <div className="container">
        <div className="section-header text-center">
          <h2 className="heading-2 text-gradient">{t.integration}</h2>
          <p className="body-large">{t.techStack}</p>
        </div>
        
        <div className="integration-content">
          <div className="integration-steps">
            <div className="step-card card">
              <div className="step-number">1</div>
              <h3 className="heading-4">Connect</h3>
              <p className="body-medium">Seamlessly connect to your existing GIS infrastructure</p>
            </div>
            
            <div className="step-card card">
              <div className="step-number">2</div>
              <h3 className="heading-4">Configure</h3>
              <p className="body-medium">Configure data sources and visualization preferences</p>
            </div>
            
            <div className="step-card card">
              <div className="step-number">3</div>
              <h3 className="heading-4">Analyze</h3>
              <p className="body-medium">Start analyzing and visualizing your geospatial data</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}