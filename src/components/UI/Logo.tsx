import petronasLogo from '../../assets/images/petronas.jpeg';
import siriusLogo from '../../assets/images/sirius.jpeg';

interface LogoProps {
  variant?: 'full' | 'petronas-only' | 'sirius-only';
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export function Logo({ variant = 'full', size = 'medium', className = '' }: LogoProps) {
  const sizeClasses = {
    small: 'logo-small',
    medium: 'logo-medium',
    large: 'logo-large'
  };

  if (variant === 'petronas-only') {
    return (
      <div className={`logo-container ${sizeClasses[size]} ${className}`}>
        <img 
          src={petronasLogo} 
          alt="PETRONAS"
          className="petronas-logo-img"
        />
      </div>
    );
  }

  if (variant === 'sirius-only') {
    return (
      <div className={`logo-container ${sizeClasses[size]} ${className}`}>
        <img 
          src={siriusLogo} 
          alt="SIRIUS Platform"
          className="sirius-logo-img"
        />
      </div>
    );
  }

  return (
    <div className={`logo-container logo-full ${sizeClasses[size]} ${className}`}>
      <div className="logo-stack">
        <img 
          src={siriusLogo} 
          alt="SIRIUS Platform"
          className="sirius-logo-img"
        />
        <div className="logo-divider"></div>
        <img 
          src={petronasLogo} 
          alt="PETRONAS"
          className="petronas-logo-img"
        />
      </div>
    </div>
  );
}