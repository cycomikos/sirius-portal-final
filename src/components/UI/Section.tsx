import { ReactNode } from 'react';

interface SectionProps {
  id?: string;
  className?: string;
  children: ReactNode;
  background?: 'primary' | 'secondary';
}

export function Section({ 
  id, 
  className = '', 
  children, 
  background = 'primary' 
}: SectionProps) {
  const baseClasses = `section ${background === 'secondary' ? 'bg-secondary' : 'bg-primary'} ${className}`;
  
  return (
    <section id={id} className={baseClasses}>
      <div className="container">
        {children}
      </div>
    </section>
  );
}