# Security Configuration Guide

## Content Security Policy (CSP) Implementation

### Development Environment
The CSP is configured in `vite.config.ts` for development with permissive policies (required for Vite dev server):

```typescript
'Content-Security-Policy': [
  "default-src 'self'",
  "script-src 'self' https://cdnjs.cloudflare.com 'unsafe-inline' 'unsafe-eval'", // Vite needs these
  "style-src 'self' https://fonts.googleapis.com 'unsafe-inline'", // HMR and dev styles
  "img-src 'self' data: https: http:", // Flexible for development
  "font-src 'self' data: https://fonts.gstatic.com",
  "connect-src 'self' ws://localhost:* wss://localhost:* https://cdnjs.cloudflare.com https://images.unsplash.com", // WebSocket for HMR
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "worker-src 'self' blob:",
  "manifest-src 'self'"
].join('; ')
```

**Note:** Development CSP is more permissive to accommodate Vite's dev server requirements like Hot Module Replacement (HMR) and inline scripts.

### Production Environment (Nginx)
Configure in `nginx.conf` or your web server:

```nginx
add_header Content-Security-Policy "default-src 'self'; script-src 'self' https://cdnjs.cloudflare.com; style-src 'self' https://fonts.googleapis.com; img-src 'self' data: https://images.unsplash.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://cdnjs.cloudflare.com https://images.unsplash.com; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests; block-all-mixed-content;" always;
```

### Apache Configuration
```apache
Header always set Content-Security-Policy "default-src 'self'; script-src 'self' https://cdnjs.cloudflare.com; style-src 'self' https://fonts.googleapis.com; img-src 'self' data: https://images.unsplash.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://cdnjs.cloudflare.com https://images.unsplash.com; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests; block-all-mixed-content;"
```

### Node.js/Express Configuration
```javascript
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', [
    "default-src 'self'",
    "script-src 'self' https://cdnjs.cloudflare.com",
    "style-src 'self' https://fonts.googleapis.com",
    "img-src 'self' data: https://images.unsplash.com",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self' https://cdnjs.cloudflare.com https://images.unsplash.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
    "block-all-mixed-content"
  ].join('; '));
  next();
});
```

## Security Headers

### Essential Security Headers
```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
X-DNS-Prefetch-Control: off
Permissions-Policy: geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), accelerometer=(), gyroscope=()
```

## External Resources

### Allowed Domains
- `cdnjs.cloudflare.com` - Three.js library
- `fonts.googleapis.com` - Google Fonts CSS
- `fonts.gstatic.com` - Google Fonts files
- `images.unsplash.com` - Earth texture image

### Resource Integrity
Three.js is loaded with Subresource Integrity (SRI) hash:
```
integrity="sha512-dLxUelApnYxpLt6K2iomGngnHO83iUvZytA3YjDUCjT0HDOHKXnVYdf3hU4JjM8uEhxf9nD1/ey98U3t2vZ0qQ=="
```

## Security Monitoring

The application includes runtime security monitoring that:
- Detects CSP violations
- Monitors for mixed content
- Validates external resource domains
- Reports security warnings in development

## Testing CSP

To test if CSP is working:

1. Open DevTools Console
2. Look for CSP violation reports
3. Check for security warnings from our monitoring system
4. Use online CSP validators like [CSP Evaluator](https://csp-evaluator.withgoogle.com/)

## Deployment Checklist

- [ ] CSP headers are configured on web server
- [ ] All security headers are present
- [ ] HTTPS is enforced
- [ ] External resources use integrity hashes where possible
- [ ] No inline scripts or styles (use nonces if needed)
- [ ] Security monitoring is active
- [ ] CSP violations are logged/reported