/**
 * Input Validation Utilities
 * Provides validation schemas and functions for all forms
 */

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// URL validation regex
const URL_REGEX = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;

// Password requirements
const PASSWORD_MIN_LENGTH = 6;

interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Validate email address
 */
export function validateEmail(email: string): ValidationResult {
  const errors: string[] = [];
  
  if (!email || email.trim() === '') {
    errors.push('Email is required');
  } else if (!EMAIL_REGEX.test(email)) {
    errors.push('Invalid email format');
  } else if (email.length > 255) {
    errors.push('Email is too long');
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validate password
 */
export function validatePassword(password: string): ValidationResult {
  const errors: string[] = [];
  
  if (!password) {
    errors.push('Password is required');
  } else if (password.length < PASSWORD_MIN_LENGTH) {
    errors.push(`Password must be at least ${PASSWORD_MIN_LENGTH} characters`);
  } else if (password.length > 128) {
    errors.push('Password is too long');
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validate name
 */
export function validateName(name: string): ValidationResult {
  const errors: string[] = [];
  
  if (!name || name.trim() === '') {
    errors.push('Name is required');
  } else if (name.length < 2) {
    errors.push('Name must be at least 2 characters');
  } else if (name.length > 100) {
    errors.push('Name is too long');
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validate URL
 */
export function validateUrl(url: string, required: boolean = false): ValidationResult {
  const errors: string[] = [];
  
  if (!url || url.trim() === '') {
    if (required) {
      errors.push('URL is required');
    }
    return { valid: !required, errors };
  }
  
  if (!URL_REGEX.test(url)) {
    errors.push('Invalid URL format');
  } else if (url.length > 2000) {
    errors.push('URL is too long');
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validate number in range
 */
export function validateNumber(
  value: number | string,
  options: { min?: number; max?: number; required?: boolean; name?: string } = {}
): ValidationResult {
  const errors: string[] = [];
  const { min, max, required = true, name = 'Value' } = options;
  
  const num = typeof value === 'string' ? parseFloat(value) : value;
  
  if (value === undefined || value === null || value === '') {
    if (required) {
      errors.push(`${name} is required`);
    }
    return { valid: !required, errors };
  }
  
  if (isNaN(num)) {
    errors.push(`${name} must be a number`);
  } else {
    if (min !== undefined && num < min) {
      errors.push(`${name} must be at least ${min}`);
    }
    if (max !== undefined && num > max) {
      errors.push(`${name} must be at most ${max}`);
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validate discount percentage
 */
export function validateDiscount(discount: number | string): ValidationResult {
  return validateNumber(discount, { min: 0, max: 100, name: 'Discount percentage' });
}

/**
 * Validate sale data
 */
export interface SaleData {
  title?: string;
  description?: string;
  brandId?: string;
  brandName?: string;
  category?: string;
  discountPercentage?: number | string;
  image?: string;
  link?: string;
  startDate?: string | Date;
  endDate?: string | Date;
}

export function validateSale(data: SaleData): ValidationResult {
  const errors: string[] = [];

  // Title
  if (!data.title || data.title.trim() === '') {
    errors.push('Title is required');
  } else if (data.title.length > 200) {
    errors.push('Title is too long');
  }

  // Description
  if (!data.description || data.description.trim() === '') {
    errors.push('Description is required');
  } else if (data.description.length > 5000) {
    errors.push('Description is too long');
  }

  // Brand
  if (!data.brandId) {
    errors.push('Brand is required');
  }

  // Category
  if (!data.category) {
    errors.push('Category is required');
  }

  // Discount
  const discountResult = validateDiscount(data.discountPercentage || 0);
  errors.push(...discountResult.errors);

  // Image
  if (!data.image) {
    errors.push('Image is required');
  }

  // Link
  if (!data.link) {
    errors.push('Sale link is required');
  }

  // Dates
  if (!data.startDate) {
    errors.push('Start date is required');
  }
  if (!data.endDate) {
    errors.push('End date is required');
  }
  if (data.startDate && data.endDate) {
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    if (end < start) {
      errors.push('End date must be after start date');
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validate contact form
 */
export interface ContactData {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export function validateContact(data: ContactData): ValidationResult {
  const errors: string[] = [];

  const nameResult = validateName(data.name || '');
  const emailResult = validateEmail(data.email || '');
  
  errors.push(...nameResult.errors);
  errors.push(...emailResult.errors);

  if (!data.subject || data.subject.trim() === '') {
    errors.push('Subject is required');
  } else if (data.subject.length > 200) {
    errors.push('Subject is too long');
  }

  if (!data.message || data.message.trim() === '') {
    errors.push('Message is required');
  } else if (data.message.length > 5000) {
    errors.push('Message is too long');
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Sanitize string to prevent XSS
 */
export function sanitizeString(str: string): string {
  if (!str) return '';
  return str
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Validate and sanitize slug
 */
export function validateSlug(slug: string): ValidationResult {
  const errors: string[] = [];
  
  if (!slug || slug.trim() === '') {
    errors.push('Slug is required');
  } else if (!/^[a-z0-9-]+$/.test(slug)) {
    errors.push('Slug can only contain lowercase letters, numbers, and hyphens');
  } else if (slug.length > 100) {
    errors.push('Slug is too long');
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Create URL-safe slug from string
 */
export function createSlug(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
