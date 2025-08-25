interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  centered?: boolean;
}

export function SectionHeader({ 
  title, 
  subtitle, 
  description, 
  centered = true 
}: SectionHeaderProps) {
  return (
    <div className={`section-header ${centered ? 'text-center' : ''}`}>
      {subtitle && (
        <p className="section-subtitle">{subtitle}</p>
      )}
      <h2 className="heading-2 text-gradient">{title}</h2>
      {description && (
        <p className="body-large">{description}</p>
      )}
    </div>
  );
}