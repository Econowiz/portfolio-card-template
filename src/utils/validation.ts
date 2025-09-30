/**
 * Comprehensive form validation utilities
 */

export interface ValidationRule {
  required?: {
    value: boolean
    message: string
  }
  minLength?: {
    value: number
    message: string
  }
  maxLength?: {
    value: number
    message: string
  }
  pattern?: {
    value: RegExp
    message: string
  }
  validate?: {
    [key: string]: (value: string) => boolean | string
  }
}

export interface ValidationSchema {
  [fieldName: string]: ValidationRule
}

/**
 * Validation patterns and constants
 */
export const VALIDATION_PATTERNS = {
  // Enhanced email pattern with better validation
  EMAIL: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
  
  // Name pattern - letters, spaces, hyphens, apostrophes
  NAME: /^[a-zA-ZÀ-ÿ\s'-]+$/,
  
  // Company name - letters, numbers, spaces, common business characters
  COMPANY: /^[a-zA-ZÀ-ÿ0-9\s&.,'-]+$/,
  
  // No HTML tags or script injection
  NO_HTML: /^[^<>]*$/,
  
  // No excessive whitespace or special characters
  // eslint-disable-next-line no-control-regex
  CLEAN_TEXT: /^(?!.*\s{3,})[^\x00-\x1F\x7F]*$/
} as const

export const VALIDATION_LIMITS = {
  FULL_NAME: {
    MIN: 2,
    MAX: 100
  },
  EMAIL: {
    MIN: 5,
    MAX: 254 // RFC 5321 limit
  },
  COMPANY: {
    MIN: 2,
    MAX: 200
  },
  MESSAGE: {
    MIN: 10,
    MAX: 2000
  }
} as const

/**
 * Custom validation functions
 */
export const customValidators = {
  /**
   * Validate name format and content
   */
  validateName: (value: string): boolean | string => {
    if (!value) return true // Let required handle empty values
    
    const trimmed = value.trim()
    
    // Check for minimum meaningful content
    if (trimmed.length < 2) {
      return 'Name must be at least 2 characters long'
    }
    
    // Check for valid characters
    if (!VALIDATION_PATTERNS.NAME.test(trimmed)) {
      return 'Name can only contain letters, spaces, hyphens, and apostrophes'
    }
    
    // Check for excessive repetition
    if (/(.)\1{4,}/.test(trimmed)) {
      return 'Name contains too many repeated characters'
    }
    
    // Check for realistic name structure
    if (trimmed.split(/\s+/).length > 5) {
      return 'Please enter a reasonable name length'
    }
    
    return true
  },

  /**
   * Enhanced email validation
   */
  validateEmail: (value: string): boolean | string => {
    if (!value) return true // Let required handle empty values
    
    const trimmed = value.trim().toLowerCase()
    
    // Basic format check
    if (!VALIDATION_PATTERNS.EMAIL.test(trimmed)) {
      return 'Please enter a valid email address'
    }
    
    // Check for suspicious patterns
    const suspiciousPatterns = [
      /\+.*\+/, // Multiple + signs
      /\.{2,}/, // Multiple consecutive dots
      /@.*@/, // Multiple @ signs
      /^[0-9]+@/, // Starts with numbers only
      /\.(test|example|invalid)$/, // Test domains
    ]
    
    if (suspiciousPatterns.some(pattern => pattern.test(trimmed))) {
      return 'Please enter a valid email address'
    }
    
    // Check for reasonable length
    if (trimmed.length > VALIDATION_LIMITS.EMAIL.MAX) {
      return 'Email address is too long'
    }
    
    return true
  },

  /**
   * Validate company/organization name
   */
  validateCompany: (value: string): boolean | string => {
    if (!value) return true // Let required handle empty values
    
    const trimmed = value.trim()
    
    // Check for valid characters
    if (!VALIDATION_PATTERNS.COMPANY.test(trimmed)) {
      return 'Company name contains invalid characters'
    }
    
    // Check for excessive repetition
    if (/(.)\1{6,}/.test(trimmed)) {
      return 'Company name contains too many repeated characters'
    }
    
    return true
  },

  /**
   * Validate message content
   */
  validateMessage: (value: string): boolean | string => {
    if (!value) return true // Let required handle empty values
    
    const trimmed = value.trim()
    
    // Check for HTML/script injection
    if (!VALIDATION_PATTERNS.NO_HTML.test(trimmed)) {
      return 'Message cannot contain HTML tags'
    }
    
    // Check for clean text
    if (!VALIDATION_PATTERNS.CLEAN_TEXT.test(trimmed)) {
      return 'Message contains invalid characters'
    }
    
    // Check for excessive repetition
    if (/(.)\1{10,}/.test(trimmed)) {
      return 'Message contains too many repeated characters'
    }
    
    // Check for reasonable word count
    const wordCount = trimmed.split(/\s+/).filter(word => word.length > 0).length
    if (wordCount < 3) {
      return 'Please write a more detailed message'
    }
    
    if (wordCount > 500) {
      return 'Message is too long. Please keep it under 500 words'
    }
    
    // Check for spam-like patterns
    const spamPatterns = [
      /\b(click here|visit now|act now|limited time|urgent|immediate)\b/i,
      /\b(make money|earn \$|guaranteed|risk-free|no obligation)\b/i,
      /(https?:\/\/[^\s]+){3,}/i, // Multiple URLs
      /[A-Z]{30,}/, // Too much caps
    ]
    
    if (spamPatterns.some(pattern => pattern.test(trimmed))) {
      return 'Message appears to contain spam content'
    }
    
    return true
  }
}

/**
 * Real-time validation functions for immediate feedback
 */
export const realTimeValidators = {
  validateNameRealTime: (value: string): string | boolean => {
    if (!value.trim()) return true // Don't show error for empty field
    if (value.length < 2) return 'Name must be at least 2 characters'
    if (value.length > 100) return 'Name is too long'
    if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(value)) return 'Name can only contain letters, spaces, hyphens, and apostrophes'
    if (/(.)\1{4,}/.test(value)) return 'Too many repeated characters'
    return true
  },

  validateEmailRealTime: (value: string): string | boolean => {
    if (!value.trim()) return true // Don't show error for empty field
    if (value.length < 5) return 'Email is too short'
    if (value.length > 254) return 'Email is too long'
    if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(value)) {
      return 'Please enter a valid email address'
    }
    return true
  },

  validateCompanyRealTime: (value: string): string | boolean => {
    if (!value.trim()) return true // Don't show error for empty field
    if (value.length < 2) return 'Company name must be at least 2 characters'
    if (value.length > 200) return 'Company name is too long'
    if (!/^[a-zA-ZÀ-ÿ0-9\s&.,'-]+$/.test(value)) return 'Company name contains invalid characters'
    if (/(.)\1{6,}/.test(value)) return 'Too many repeated characters'
    return true
  },

  validateMessageRealTime: (value: string): string | boolean => {
    if (!value.trim()) return true // Don't show error for empty field
    if (value.length < 10) return 'Message must be at least 10 characters'
    if (value.length > 2000) return 'Message is too long'
    if (/<[^>]*>/.test(value)) return 'HTML tags are not allowed'
    if (/(.)\1{10,}/.test(value)) return 'Too many repeated characters'

    const wordCount = value.trim().split(/\s+/).filter(word => word.length > 0).length
    if (wordCount < 3 && value.length >= 10) return 'Please write a more detailed message'
    if (wordCount > 500) return 'Message is too long. Please keep it under 500 words'

    return true
  }
}

/**
 * Complete validation schema for contact form
 */
export const contactFormValidation: ValidationSchema = {
  fullName: {
    required: {
      value: true,
      message: 'Full name is required'
    },
    minLength: {
      value: VALIDATION_LIMITS.FULL_NAME.MIN,
      message: `Name must be at least ${VALIDATION_LIMITS.FULL_NAME.MIN} characters`
    },
    maxLength: {
      value: VALIDATION_LIMITS.FULL_NAME.MAX,
      message: `Name must be less than ${VALIDATION_LIMITS.FULL_NAME.MAX} characters`
    },
    validate: {
      validName: customValidators.validateName
    }
  },
  
  email: {
    required: {
      value: true,
      message: 'Email address is required'
    },
    minLength: {
      value: VALIDATION_LIMITS.EMAIL.MIN,
      message: `Email must be at least ${VALIDATION_LIMITS.EMAIL.MIN} characters`
    },
    maxLength: {
      value: VALIDATION_LIMITS.EMAIL.MAX,
      message: `Email must be less than ${VALIDATION_LIMITS.EMAIL.MAX} characters`
    },
    validate: {
      validEmail: customValidators.validateEmail
    }
  },
  
  company: {
    required: {
      value: true,
      message: 'Company/Organization is required'
    },
    minLength: {
      value: VALIDATION_LIMITS.COMPANY.MIN,
      message: `Company name must be at least ${VALIDATION_LIMITS.COMPANY.MIN} characters`
    },
    maxLength: {
      value: VALIDATION_LIMITS.COMPANY.MAX,
      message: `Company name must be less than ${VALIDATION_LIMITS.COMPANY.MAX} characters`
    },
    validate: {
      validCompany: customValidators.validateCompany
    }
  },
  
  message: {
    required: {
      value: true,
      message: 'Message is required'
    },
    minLength: {
      value: VALIDATION_LIMITS.MESSAGE.MIN,
      message: `Message must be at least ${VALIDATION_LIMITS.MESSAGE.MIN} characters`
    },
    maxLength: {
      value: VALIDATION_LIMITS.MESSAGE.MAX,
      message: `Message must be less than ${VALIDATION_LIMITS.MESSAGE.MAX} characters`
    },
    validate: {
      validMessage: customValidators.validateMessage
    }
  }
}
