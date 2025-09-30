/**
 * Environment variable validation and configuration utilities
 */

export interface EmailJSConfig {
  serviceId: string
  templateId: string
  publicKey: string
}

export interface ValidationResult {
  isValid: boolean
  errors: string[]
  config?: EmailJSConfig
}

/**
 * Validates EmailJS environment variables
 * @returns ValidationResult with validation status and configuration
 */
export function validateEmailJSConfig(): ValidationResult {
  const errors: string[] = []
  
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

  // Check if variables exist
  if (!serviceId) {
    errors.push('VITE_EMAILJS_SERVICE_ID is required')
  }
  if (!templateId) {
    errors.push('VITE_EMAILJS_TEMPLATE_ID is required')
  }
  if (!publicKey) {
    errors.push('VITE_EMAILJS_PUBLIC_KEY is required')
  }

  // Check for placeholder values
  const placeholderValues = [
    'service_placeholder',
    'template_placeholder', 
    'public_key_placeholder',
    'your_service_id_here',
    'your_template_id_here',
    'your_public_key_here'
  ]

  if (serviceId && placeholderValues.includes(serviceId)) {
    errors.push('VITE_EMAILJS_SERVICE_ID contains placeholder value. Please update with your actual EmailJS service ID.')
  }
  if (templateId && placeholderValues.includes(templateId)) {
    errors.push('VITE_EMAILJS_TEMPLATE_ID contains placeholder value. Please update with your actual EmailJS template ID.')
  }
  if (publicKey && placeholderValues.includes(publicKey)) {
    errors.push('VITE_EMAILJS_PUBLIC_KEY contains placeholder value. Please update with your actual EmailJS public key.')
  }

  const isValid = errors.length === 0

  return {
    isValid,
    errors,
    config: isValid ? { serviceId, templateId, publicKey } : undefined
  }
}

/**
 * Gets EmailJS configuration with validation
 * @param throwOnError - Whether to throw an error if validation fails
 * @returns EmailJS configuration or null if invalid
 */
export function getEmailJSConfig(throwOnError: boolean = false): EmailJSConfig | null {
  const validation = validateEmailJSConfig()
  
  if (!validation.isValid) {
    const errorMessage = `EmailJS configuration is invalid:\n${validation.errors.join('\n')}`
    
    if (throwOnError) {
      throw new Error(errorMessage)
    }
    
    // In development, only log once or when specifically requested
    if (import.meta.env.PROD || import.meta.env.VITE_DEBUG_EMAIL === 'true') {
      console.warn(errorMessage)
    }
    return null
  }
  
  return validation.config!
}

/**
 * Checks if the application is running in production mode
 */
export function isProduction(): boolean {
  return import.meta.env.PROD
}

/**
 * Checks if the application is running in development mode
 */
export function isDevelopment(): boolean {
  return import.meta.env.DEV
}

/**
 * Gets the current environment mode
 */
export function getEnvironmentMode(): 'development' | 'production' | 'test' {
  if (import.meta.env.PROD) return 'production'
  if (import.meta.env.DEV) return 'development'
  return 'test'
}
