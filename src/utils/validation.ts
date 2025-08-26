export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  email?: boolean;
  phone?: boolean;
  custom?: (value: string) => boolean;
  message?: string;
}

export const validationRules = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 100,
    pattern: /^[a-zA-Z\s'-\.]+$/,
    message: 'Name must contain only letters, spaces, hyphens, apostrophes, and periods'
  },
  email: {
    required: true,
    email: true,
    maxLength: 254,
    message: 'Please enter a valid email address'
  },
  phone: {
    required: true,
    phone: true,
    message: 'Please enter a valid phone number'
  },
  department: {
    required: false,
    maxLength: 100,
    pattern: /^[a-zA-Z\s'-\.]+$/,
    message: 'Department must contain only letters, spaces, hyphens, apostrophes, and periods'
  },
  subject: {
    required: true,
    message: 'Please select a subject'
  },
  message: {
    required: true,
    minLength: 10,
    maxLength: 2000,
    message: 'Message must be between 10 and 2000 characters'
  }
};

export function validateField(value: string, rules: ValidationRule): ValidationResult {
  // Trim and check if required
  const trimmedValue = value.trim();
  
  if (rules.required && !trimmedValue) {
    return { isValid: false, error: 'This field is required' };
  }

  // If empty and not required, it's valid
  if (!trimmedValue && !rules.required) {
    return { isValid: true };
  }

  // Check minimum length
  if (rules.minLength && trimmedValue.length < rules.minLength) {
    return { 
      isValid: false, 
      error: `Must be at least ${rules.minLength} characters long` 
    };
  }

  // Check maximum length
  if (rules.maxLength && trimmedValue.length > rules.maxLength) {
    return { 
      isValid: false, 
      error: `Must be no more than ${rules.maxLength} characters long` 
    };
  }

  // Email validation
  if (rules.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedValue)) {
      return { isValid: false, error: rules.message || 'Invalid email format' };
    }
    
    // Additional email validation for common issues
    if (trimmedValue.includes('..') || trimmedValue.startsWith('.') || trimmedValue.endsWith('.')) {
      return { isValid: false, error: 'Invalid email format' };
    }
  }

  // Phone validation
  if (rules.phone) {
    // Remove all non-digit characters for validation
    const phoneDigits = trimmedValue.replace(/\D/g, '');
    const phoneRegex = /^[\+]?[\d\s\-\(\)\.]{7,}$/;
    
    if (!phoneRegex.test(trimmedValue) || phoneDigits.length < 7 || phoneDigits.length > 15) {
      return { isValid: false, error: rules.message || 'Invalid phone number format' };
    }
  }

  // Pattern validation
  if (rules.pattern && !rules.pattern.test(trimmedValue)) {
    return { isValid: false, error: rules.message || 'Invalid format' };
  }

  // Custom validation
  if (rules.custom && !rules.custom(trimmedValue)) {
    return { isValid: false, error: rules.message || 'Invalid value' };
  }

  return { isValid: true };
}

export function validateForm(formData: Record<string, string>): Record<string, ValidationResult> {
  const results: Record<string, ValidationResult> = {};
  
  for (const [field, value] of Object.entries(formData)) {
    const rules = validationRules[field as keyof typeof validationRules];
    if (rules) {
      results[field] = validateField(value, rules);
    }
  }
  
  return results;
}

export function isFormValid(validationResults: Record<string, ValidationResult>): boolean {
  return Object.values(validationResults).every(result => result.isValid);
}