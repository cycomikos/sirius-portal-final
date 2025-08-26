/**
 * HTML entity encoding map for basic XSS prevention
 */
const htmlEntities: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;'
};

/**
 * Escapes HTML characters to prevent XSS attacks
 */
export function escapeHtml(text: string): string {
  return text.replace(/[&<>"'\/]/g, (match) => htmlEntities[match]);
}

/**
 * Removes potentially dangerous characters and patterns
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }

  return input
    // Remove null bytes and control characters (except newlines and tabs)
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    // Remove potential script injections
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove other potentially dangerous HTML tags
    .replace(/<\s*\/?(?:iframe|object|embed|applet|meta|link)\b[^>]*>/gi, '')
    // Remove javascript: and data: URLs
    .replace(/javascript\s*:/gi, '')
    .replace(/data\s*:/gi, '')
    // Remove onXXX event handlers
    .replace(/\s*on\w+\s*=\s*[^>\s]+/gi, '')
    // Trim whitespace
    .trim();
}

/**
 * Sanitizes form data object
 */
export function sanitizeFormData<T extends Record<string, string>>(formData: T): T {
  const sanitized = {} as T;
  
  for (const [key, value] of Object.entries(formData)) {
    sanitized[key as keyof T] = sanitizeInput(value) as T[keyof T];
  }
  
  return sanitized;
}

/**
 * Normalizes whitespace in text (removes excessive spaces, newlines)
 */
export function normalizeWhitespace(text: string): string {
  return text
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/\n\s*\n/g, '\n\n') // Normalize multiple newlines to double newlines
    .trim();
}

/**
 * Sanitizes phone number input to allow only valid characters
 */
export function sanitizePhoneNumber(phone: string): string {
  return phone.replace(/[^\d\s\-\(\)\.\+]/g, '');
}

/**
 * Sanitizes email input to remove dangerous characters
 */
export function sanitizeEmail(email: string): string {
  return email
    .toLowerCase()
    .trim()
    .replace(/[^\w\.\-@\+]/g, '') // Only allow word chars, dots, hyphens, @ and +
    .slice(0, 254); // RFC 5321 limit
}

/**
 * Comprehensive sanitization for different field types
 */
export function sanitizeByFieldType(value: string, fieldType: string): string {
  const baseValue = sanitizeInput(value);
  
  switch (fieldType) {
    case 'email':
      return sanitizeEmail(baseValue);
    case 'phone':
      return sanitizePhoneNumber(baseValue);
    case 'message':
      return normalizeWhitespace(baseValue);
    default:
      return baseValue;
  }
}