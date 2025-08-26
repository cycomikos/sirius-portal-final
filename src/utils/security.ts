/**
 * Security utilities for runtime security checks and enhancements
 */

/**
 * Checks if the current environment is secure (HTTPS or localhost)
 */
export function isSecureContext(): boolean {
  if (typeof window === 'undefined') return true; // SSR
  return window.location.protocol === 'https:' || 
         window.location.hostname === 'localhost' ||
         window.location.hostname === '127.0.0.1';
}

/**
 * Checks if CSP is enabled by multiple methods
 */
export function checkCSPEnabled(): boolean {
  if (typeof document === 'undefined') return false;
  
  // Method 1: Check for CSP headers or meta tags
  const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
  if (cspMeta) {
    return true;
  }
  
  // Method 2: Check if CSP violation events are supported (indicates CSP is likely active)
  if ('SecurityPolicyViolationEvent' in window) {
    // Method 3: Try to detect via inline script test
    try {
      // Create a test that should be blocked by CSP
      const script = document.createElement('script');
      script.textContent = 'window.__csp_test__ = true;';
      
      // Listen for CSP violation
      let violationDetected = false;
      const violationHandler = () => {
        violationDetected = true;
      };
      
      document.addEventListener('securitypolicyviolation', violationHandler, { once: true });
      
      document.head.appendChild(script);
      document.head.removeChild(script);
      
      // Clean up
      document.removeEventListener('securitypolicyviolation', violationHandler);
      
      // If we detected a violation OR the variable wasn't set, CSP is working
      const cspWorking = violationDetected || !(window as any).__csp_test__;
      delete (window as any).__csp_test__;
      
      return cspWorking;
    } catch (error) {
      return true; // Assume CSP is working if there's an error
    }
  }
  
  // Fallback: assume CSP is not active if we can't detect it
  return false;
}

/**
 * Gets the CSP nonce from the meta tag
 */
export function getCSPNonce(): string | null {
  if (typeof document === 'undefined') return null;
  
  const nonceMeta = document.querySelector('meta[name="csp-nonce"]');
  return nonceMeta?.getAttribute('content') || null;
}

/**
 * Validates that external resources are from allowed domains
 */
export function isAllowedDomain(url: string): boolean {
  const allowedDomains = [
    'cdnjs.cloudflare.com',
    'cdn.jsdelivr.net',
    'images.unsplash.com',
    'fonts.googleapis.com',
    'fonts.gstatic.com'
  ];
  
  try {
    const urlObj = new URL(url);
    return allowedDomains.includes(urlObj.hostname);
  } catch {
    return false;
  }
}

/**
 * Creates a secure script element with proper attributes
 */
export function createSecureScript(src: string, options: {
  integrity?: string;
  crossOrigin?: string;
  referrerPolicy?: string;
  nonce?: string;
} = {}): HTMLScriptElement | null {
  if (!isAllowedDomain(src)) {
    console.warn('Attempted to load script from non-allowed domain:', src);
    return null;
  }
  
  const script = document.createElement('script');
  script.src = src;
  script.async = true;
  script.defer = true;
  
  if (options.integrity) {
    script.integrity = options.integrity;
  }
  
  script.crossOrigin = options.crossOrigin || 'anonymous';
  script.referrerPolicy = options.referrerPolicy || 'no-referrer';
  
  if (options.nonce || getCSPNonce()) {
    script.nonce = options.nonce || getCSPNonce()!;
  }
  
  return script;
}

/**
 * Creates a secure image element with proper attributes
 */
export function createSecureImage(src: string, options: {
  crossOrigin?: string;
  referrerPolicy?: string;
  maxWidth?: number;
  maxHeight?: number;
} = {}): HTMLImageElement | null {
  if (!isAllowedDomain(src)) {
    console.warn('Attempted to load image from non-allowed domain:', src);
    return null;
  }
  
  const img = new Image();
  img.crossOrigin = options.crossOrigin || 'anonymous';
  img.referrerPolicy = options.referrerPolicy || 'no-referrer';
  img.src = src;
  
  // Add dimension validation
  if (options.maxWidth || options.maxHeight) {
    img.onload = () => {
      if (options.maxWidth && img.width > options.maxWidth) {
        console.warn('Image width exceeds maximum allowed size');
      }
      if (options.maxHeight && img.height > options.maxHeight) {
        console.warn('Image height exceeds maximum allowed size');
      }
    };
  }
  
  return img;
}

/**
 * Sanitizes URL parameters to prevent injection attacks
 */
export function sanitizeUrlParams(params: Record<string, string>): Record<string, string> {
  const sanitized: Record<string, string> = {};
  
  for (const [key, value] of Object.entries(params)) {
    // Remove dangerous characters and limit length
    const sanitizedKey = key.replace(/[<>'"&]/g, '').slice(0, 50);
    const sanitizedValue = value.replace(/[<>'"&]/g, '').slice(0, 200);
    
    if (sanitizedKey && sanitizedValue) {
      sanitized[sanitizedKey] = sanitizedValue;
    }
  }
  
  return sanitized;
}

/**
 * Performs runtime security checks and logs warnings
 */
export function performSecurityChecks(): {
  isSecure: boolean;
  cspEnabled: boolean;
  warnings: string[];
} {
  const warnings: string[] = [];
  
  // Check if running over HTTPS
  const isSecure = isSecureContext();
  if (!isSecure) {
    warnings.push('Application is not running over HTTPS in production');
  }
  
  // Check CSP (only warn in production)
  const cspEnabled = checkCSPEnabled();
  if (!cspEnabled && process.env.NODE_ENV === 'production') {
    warnings.push('Content Security Policy does not appear to be active');
  }
  
  // Check for mixed content
  if (typeof window !== 'undefined' && window.location.protocol === 'https:') {
    const httpResources = document.querySelectorAll('script[src^="http://"], link[href^="http://"], img[src^="http://"]');
    if (httpResources.length > 0) {
      warnings.push(`Found ${httpResources.length} HTTP resources on HTTPS page (mixed content)`);
    }
  }
  
  // Check for inline scripts (potential CSP violations)
  if (typeof document !== 'undefined') {
    const inlineScripts = document.querySelectorAll('script:not([src])');
    if (inlineScripts.length > 1) { // Allow one for the main app
      warnings.push(`Found ${inlineScripts.length} inline scripts - consider using nonces or moving to external files`);
    }
  }
  
  // Log warnings in development
  if (process.env.NODE_ENV === 'development' && warnings.length > 0) {
    console.group('🔒 Security Warnings');
    warnings.forEach(warning => console.warn('⚠️', warning));
    console.groupEnd();
  }
  
  return {
    isSecure,
    cspEnabled,
    warnings
  };
}

/**
 * Initialize security monitoring (call this in your app startup)
 */
export function initSecurityMonitoring(): void {
  if (typeof window === 'undefined') return;
  
  // Perform initial security checks
  setTimeout(() => {
    performSecurityChecks();
  }, 1000);
  
  // Monitor for CSP violations (if supported)
  if ('SecurityPolicyViolationEvent' in window) {
    document.addEventListener('securitypolicyviolation', (event) => {
      console.warn('🔒 CSP Violation:', {
        directive: event.violatedDirective,
        blockedURI: event.blockedURI,
        originalPolicy: event.originalPolicy
      });
      
      // In production, you might want to report this to your logging service
      if (process.env.NODE_ENV === 'production') {
        // Example: reportCSPViolation(event);
      }
    });
  }
  
  // Monitor for mixed content warnings
  if (window.location.protocol === 'https:') {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;
            
            // Check for HTTP resources being added
            const httpSrc = element.getAttribute('src');
            const httpHref = element.getAttribute('href');
            
            if (httpSrc?.startsWith('http://') || httpHref?.startsWith('http://')) {
              console.warn('🔒 Mixed Content Warning: HTTP resource added to HTTPS page', element);
            }
          }
        });
      });
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
  }
}