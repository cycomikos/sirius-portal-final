import { ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  onClick?: () => void;
  href?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string;
}

export function Button({ 
  children, 
  variant = 'primary', 
  onClick, 
  href, 
  type = 'button',
  disabled = false,
  className = ''
}: Omit<ButtonProps, 'size'>) {
  const baseClasses = `btn-${variant} ${className}`;
  
  if (href) {
    return (
      <a 
        href={href} 
        className={baseClasses}
        onClick={onClick ? (e) => { e.preventDefault(); onClick(); } : undefined}
      >
        {children}
      </a>
    );
  }

  return (
    <button 
      type={type} 
      className={baseClasses}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}