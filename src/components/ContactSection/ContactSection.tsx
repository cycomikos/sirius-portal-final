import { useLanguage } from '../../context/LanguageContext';
import { Section, SectionHeader, Button } from '../UI';
import { useForm } from '../../hooks';
import './ContactSection.css';

export function ContactSection() {
  const { t } = useLanguage();
  const { formData, isSubmitting, handleInputChange, handleSubmit } = useForm();

  const onSubmitSuccess = () => {
    alert(t.formSuccess);
  };

  return (
    <Section id="contact" className="contact-section" background="secondary">
      <SectionHeader
        title={t.contactTitle}
        description={t.contactDescription}
      />
        
        <div className="contact-content">
          <div className="contact-form-container">
            <h3 className="heading-3">{t.formTitle}</h3>
            <p className="body-medium">{t.formSubtitle}</p>
            
            <form className="contact-form" onSubmit={(e) => handleSubmit(e, onSubmitSuccess)}>
              <div className="form-group">
                <label htmlFor="name">{t.nameLabel}</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder={t.namePlaceholder}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">{t.emailLabel}</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder={t.emailPlaceholder}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="phone">{t.phoneLabel}</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder={t.phonePlaceholder}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="subject">{t.subjectLabel}</label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">{t.subjectPlaceholder}</option>
                  <option value="general">{t.generalInquiry}</option>
                  <option value="technical">{t.technicalSupport}</option>
                  <option value="integration">{t.integrationHelp}</option>
                  <option value="training">{t.training}</option>
                  <option value="demo">{t.requestDemo}</option>
                  <option value="other">{t.other}</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="message">{t.messageLabel}</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder={t.messagePlaceholder}
                  rows={5}
                  required
                />
              </div>
              
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : t.submitMessage}
              </Button>
            </form>
          </div>
        </div>
    </Section>
  );
}