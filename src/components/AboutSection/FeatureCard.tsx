import { FeatureItem } from '../../types';

export function FeatureCard({ icon, title, description }: FeatureItem) {
  return (
    <div className="feature-card card fade-in">
      <div className="feature-icon">{icon}</div>
      <h3 className="heading-4">{title}</h3>
      <p className="body-medium">{description}</p>
    </div>
  );
}