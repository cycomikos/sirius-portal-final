import { useState, useEffect } from 'react';

export function useAppState() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHeaderTransparent, setIsHeaderTransparent] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileMenuOpen]);

  const handleHeaderMouseEnter = () => {
    if (isScrolled) {
      setIsHeaderTransparent(false);
    }
  };

  const handleHeaderMouseLeave = () => {
    if (isScrolled) {
      setIsHeaderTransparent(true);
    }
  };

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    
    const element = document.querySelector(href);
    if (element) {
      const headerHeight = window.innerWidth <= 768 ? 70 : 80;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY - headerHeight;
      
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  };

  return {
    isScrolled,
    isHeaderTransparent,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    handleHeaderMouseEnter,
    handleHeaderMouseLeave,
    handleNavClick
  };
}