/**
 * Input sanitization utilities to prevent XSS and clean user input
 */

/**
 * HTML entities for escaping
 */
const HTML_ENTITIES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
  '`': '&#96;',
  '=': '&#x3D;'
}

/**
 * Escape HTML entities to prevent XSS
 */
export function escapeHtml(text: string): string {
  return text.replace(/[&<>"'`=/]/g, (match) => HTML_ENTITIES[match] || match)
}

/**
 * Remove HTML tags completely
 */
export function stripHtml(text: string): string {
  return text.replace(/<[^>]*>/g, '')
}

/**
 * Normalize whitespace - remove excessive spaces, tabs, newlines
 */
export function normalizeWhitespace(text: string): string {
  return text
    .replace(/\s+/g, ' ') // Replace multiple whitespace with single space
    .replace(/^\s+|\s+$/g, '') // Trim leading/trailing whitespace
}

/**
 * Remove control characters and non-printable characters
 */
export function removeControlCharacters(text: string): string {
  // Remove control characters (0x00-0x1F) except tab (0x09), newline (0x0A), carriage return (0x0D)
  // eslint-disable-next-line no-control-regex
  return text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
}

/**
 * Sanitize name input
 */
export function sanitizeName(name: string): string {
  if (!name) return ''
  
  let sanitized = name
  
  // Remove HTML tags
  sanitized = stripHtml(sanitized)
  
  // Remove control characters
  sanitized = removeControlCharacters(sanitized)
  
  // Normalize whitespace
  sanitized = normalizeWhitespace(sanitized)
  
  // Remove excessive punctuation
  sanitized = sanitized.replace(/[^\w\s'-]/g, '')
  
  // Limit consecutive special characters
  sanitized = sanitized.replace(/[-']{3,}/g, '--')
  
  // Ensure reasonable length
  if (sanitized.length > 100) {
    sanitized = sanitized.substring(0, 100).trim()
  }
  
  return sanitized
}

/**
 * Sanitize email input
 */
export function sanitizeEmail(email: string): string {
  if (!email) return ''
  
  let sanitized = email
  
  // Remove HTML tags
  sanitized = stripHtml(sanitized)
  
  // Remove control characters
  sanitized = removeControlCharacters(sanitized)
  
  // Remove whitespace (emails shouldn't have spaces)
  sanitized = sanitized.replace(/\s/g, '')
  
  // Convert to lowercase
  sanitized = sanitized.toLowerCase()
  
  // Remove dangerous characters that shouldn't be in emails
  sanitized = sanitized.replace(/[<>"'`]/g, '')
  
  // Ensure reasonable length
  if (sanitized.length > 254) {
    sanitized = sanitized.substring(0, 254)
  }
  
  return sanitized
}

/**
 * Sanitize company name input
 */
export function sanitizeCompany(company: string): string {
  if (!company) return ''
  
  let sanitized = company
  
  // Remove HTML tags
  sanitized = stripHtml(sanitized)
  
  // Remove control characters
  sanitized = removeControlCharacters(sanitized)
  
  // Normalize whitespace
  sanitized = normalizeWhitespace(sanitized)
  
  // Allow business-appropriate characters
  sanitized = sanitized.replace(/[^\w\s&.,'-]/g, '')
  
  // Limit consecutive special characters
  sanitized = sanitized.replace(/[&.,'-]{3,}/g, '..')
  
  // Ensure reasonable length
  if (sanitized.length > 200) {
    sanitized = sanitized.substring(0, 200).trim()
  }
  
  return sanitized
}

/**
 * Sanitize message input
 */
export function sanitizeMessage(message: string): string {
  if (!message) return ''
  
  let sanitized = message
  
  // Remove HTML tags
  sanitized = stripHtml(sanitized)
  
  // Remove control characters but preserve newlines
  // eslint-disable-next-line no-control-regex
  sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
  
  // Normalize excessive whitespace but preserve paragraph breaks
  sanitized = sanitized.replace(/[ \t]+/g, ' ') // Multiple spaces/tabs to single space
  sanitized = sanitized.replace(/\n{3,}/g, '\n\n') // Multiple newlines to double newline
  sanitized = sanitized.replace(/^\s+|\s+$/g, '') // Trim
  
  // Remove potentially dangerous patterns
  sanitized = sanitized.replace(/javascript:/gi, '')
  sanitized = sanitized.replace(/data:/gi, '')
  sanitized = sanitized.replace(/vbscript:/gi, '')
  
  // Limit excessive punctuation
  sanitized = sanitized.replace(/[!?]{4,}/g, '!!!')
  sanitized = sanitized.replace(/[.]{4,}/g, '...')
  
  // Ensure reasonable length
  if (sanitized.length > 2000) {
    sanitized = sanitized.substring(0, 2000).trim()
  }
  
  return sanitized
}

/**
 * Comprehensive form data sanitization
 */
export interface SanitizedFormData {
  fullName: string
  email: string
  company: string
  message: string
}

export function sanitizeFormData(data: {
  fullName: string
  email: string
  company: string
  message: string
}): SanitizedFormData {
  return {
    fullName: sanitizeName(data.fullName),
    email: sanitizeEmail(data.email),
    company: sanitizeCompany(data.company),
    message: sanitizeMessage(data.message)
  }
}

/**
 * Check if input contains potentially malicious content
 */
export function containsMaliciousContent(text: string): boolean {
  const maliciousPatterns = [
    /<script[^>]*>.*?<\/script>/gi,
    /javascript:/gi,
    /data:text\/html/gi,
    /vbscript:/gi,
    /onload\s*=/gi,
    /onerror\s*=/gi,
    /onclick\s*=/gi,
    /onmouseover\s*=/gi,
    /<iframe[^>]*>/gi,
    /<object[^>]*>/gi,
    /<embed[^>]*>/gi,
    /<link[^>]*>/gi,
    /<meta[^>]*>/gi
  ]
  
  return maliciousPatterns.some(pattern => pattern.test(text))
}

/**
 * Validate that sanitized data is safe
 */
export function validateSanitizedData(data: SanitizedFormData): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []
  
  // Check for malicious content
  Object.entries(data).forEach(([field, value]) => {
    if (containsMaliciousContent(value)) {
      errors.push(`${field} contains potentially malicious content`)
    }
  })
  
  // Check for empty data after sanitization
  if (!data.fullName.trim()) {
    errors.push('Name is empty after sanitization')
  }
  
  if (!data.email.trim()) {
    errors.push('Email is empty after sanitization')
  }
  
  if (!data.company.trim()) {
    errors.push('Company is empty after sanitization')
  }
  
  if (!data.message.trim()) {
    errors.push('Message is empty after sanitization')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}
