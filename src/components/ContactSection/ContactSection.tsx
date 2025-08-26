import { useLanguage } from '../../context/LanguageContext';
import { Section, SectionHeader, Button } from '../UI';
import { useForm } from '../../hooks';
import './ContactSection.css';

export function ContactSection() {
  const { t } = useLanguage();
  const { 
    formData, 
    isSubmitting, 
    handleInputChange, 
    handleBlur,
    handleSubmit, 
    getFieldError 
  } = useForm();

  const onSubmitSuccess = () => {
    alert(t.formSuccess);
  };

  const onSubmitError = (error: string) => {
    alert(`Error: ${error}`);
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
            
            <form className="contact-form" onSubmit={(e) => handleSubmit(e, onSubmitSuccess, onSubmitError)}>
              <div className="form-group">
                <label htmlFor="name">{t.nameLabel}</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  placeholder={t.namePlaceholder}
                  className={getFieldError('name') ? 'error' : ''}
                  required
                />
                {getFieldError('name') && (
                  <span className="error-message">{getFieldError('name')}</span>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="email">{t.emailLabel}</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  placeholder={t.emailPlaceholder}
                  className={getFieldError('email') ? 'error' : ''}
                  required
                />
                {getFieldError('email') && (
                  <span className="error-message">{getFieldError('email')}</span>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="phone">{t.phoneLabel}</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  placeholder={t.phonePlaceholder}
                  className={getFieldError('phone') ? 'error' : ''}
                  required
                />
                {getFieldError('phone') && (
                  <span className="error-message">{getFieldError('phone')}</span>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="subject">{t.subjectLabel}</label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={getFieldError('subject') ? 'error' : ''}
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
                {getFieldError('subject') && (
                  <span className="error-message">{getFieldError('subject')}</span>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="message">{t.messageLabel}</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  placeholder={t.messagePlaceholder}
                  rows={5}
                  className={getFieldError('message') ? 'error' : ''}
                  required
                />
                {getFieldError('message') && (
                  <span className="error-message">{getFieldError('message')}</span>
                )}
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