# Security Implementation Guide

This document outlines the security measures implemented in the Sirius Portal application.

## 🔒 Content Security Policy (CSP)

### Development
CSP headers are configured in `vite.config.ts` for the development server:
- **default-src**: Restricts to self-hosted content only
- **script-src**: Allows self, inline scripts, and CDN for Three.js
- **img-src**: Allows self, data URLs, and HTTPS images
- **object-src**: Blocked completely for security

### Production
For production deployment, use the `public/_headers` file (Netlify/Vercel compatible) or configure your web server with these headers.

## 🛡️ Form Security

### Input Validation
- **Client-side validation**: Real-time validation with user feedback
- **Field-specific rules**: Custom validation for name, email, phone, message
- **Length limits**: Prevents buffer overflow and spam
- **Pattern matching**: Ensures proper data format

### Input Sanitization
- **XSS Prevention**: HTML entity encoding and dangerous pattern removal
- **Script injection blocking**: Removes `<script>`, event handlers, and javascript: URLs
- **Whitespace normalization**: Consistent text formatting
- **Field-type specific sanitization**: Email lowercasing, phone number formatting

### Implementation Files
- `src/utils/validation.ts` - Validation rules and functions
- `src/utils/sanitization.ts` - Input sanitization utilities
- `src/hooks/useForm.ts` - Form hook with validation integration
- `src/components/ContactSection/ContactSection.tsx` - UI with error display

## 🔐 External Resource Security

### Three.js CDN Loading
- **Subresource Integrity (SRI)**: Hash verification for CDN scripts
- **CORS policy**: Proper cross-origin configuration
- **Fallback handling**: Graceful degradation if CDN fails

## 📋 Security Headers

Additional security headers implemented:
- **X-Content-Type-Options**: Prevents MIME sniffing
- **X-Frame-Options**: Prevents clickjacking
- **X-XSS-Protection**: Browser XSS protection
- **Referrer-Policy**: Controls referrer information
- **HSTS**: Forces HTTPS in production

## 🚀 Deployment Security

### Netlify/Vercel
The `public/_headers` file automatically applies security headers.

### Apache
```apache
Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: blob:; font-src 'self' data:; connect-src 'self'; media-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests"
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options DENY
Header always set X-XSS-Protection "1; mode=block"
Header always set Referrer-Policy strict-origin-when-cross-origin
```

### Nginx
```nginx
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: blob:; font-src 'self' data:; connect-src 'self'; media-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests";
add_header X-Content-Type-Options nosniff;
add_header X-Frame-Options DENY;
add_header X-XSS-Protection "1; mode=block";
add_header Referrer-Policy strict-origin-when-cross-origin;
```

## 🔄 Regular Maintenance

### Dependency Security
```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Update dependencies
npm update
```

### CSP Monitoring
Monitor CSP violations in browser console during development and consider implementing CSP reporting in production.

## ⚠️ Known Considerations

1. **'unsafe-inline' and 'unsafe-eval'**: Required for React development and Three.js compatibility
2. **External CDN**: Three.js is loaded from CDN with SRI integrity check
3. **Image loading**: External images allowed for demo content

## 📞 Security Contact

For security issues or questions, contact the development team or create an issue in the project repository.