import { useState, ChangeEvent, FormEvent } from 'react';
import { FormData, FormErrors } from '../types';
import { validateForm, isFormValid } from '../utils/validation';
import { sanitizeFormData, sanitizeByFieldType } from '../utils/sanitization';

const initialFormData: FormData = {
  name: '',
  email: '',
  phone: '',
  department: '',
  subject: '',
  message: ''
};

export function useForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    // Sanitize input based on field type
    const sanitizedValue = sanitizeByFieldType(value, name);
    
    setFormData(prev => ({ ...prev, [name]: sanitizedValue }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleBlur = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    // Validate field on blur
    const fieldValue = formData[name as keyof FormData];
    const validationResults = validateForm({ [name]: fieldValue });
    const fieldResult = validationResults[name];
    
    if (fieldResult && !fieldResult.isValid) {
      setErrors(prev => ({ ...prev, [name]: fieldResult.error }));
    }
  };

  const validateAllFields = (): boolean => {
    const sanitizedData = sanitizeFormData(formData);
    const validationResults = validateForm(sanitizedData);
    
    const newErrors: FormErrors = {};
    let hasErrors = false;

    for (const [field, result] of Object.entries(validationResults)) {
      if (!result.isValid) {
        newErrors[field as keyof FormErrors] = result.error;
        hasErrors = true;
      }
    }

    setErrors(newErrors);
    
    // Mark all fields as touched
    const allTouched: Record<string, boolean> = {};
    Object.keys(formData).forEach(key => {
      allTouched[key] = true;
    });
    setTouched(allTouched);

    return !hasErrors;
  };

  const handleSubmit = async (
    e: FormEvent,
    onSuccess: (data: FormData) => void,
    onError?: (error: string) => void
  ) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate all fields first
      if (!validateAllFields()) {
        onError?.('Please correct the errors in the form');
        return;
      }

      // Sanitize all data before submission
      const sanitizedData = sanitizeFormData(formData);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onSuccess(sanitizedData);
      setFormData(initialFormData);
      setErrors({});
      setTouched({});
    } catch (error) {
      onError?.(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setErrors({});
    setTouched({});
  };

  const getFieldError = (fieldName: keyof FormErrors): string | undefined => {
    return touched[fieldName] ? errors[fieldName] : undefined;
  };

  return {
    formData,
    errors,
    isSubmitting,
    touched,
    handleInputChange,
    handleBlur,
    handleSubmit,
    resetForm,
    getFieldError,
    isValid: isFormValid(validateForm(formData))
  };
}