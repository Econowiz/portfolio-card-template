/**
 * Build-time environment variable validation script
 * This script validates that all required environment variables are present
 * and properly configured before building for production.
 */

import { readFileSync } from 'fs'
import { join } from 'path'

interface EnvValidation {
  key: string
  required: boolean
  description: string
  placeholderValues?: string[]
}

const ENV_VALIDATIONS: EnvValidation[] = [
  {
    key: 'VITE_EMAILJS_SERVICE_ID',
    required: true,
    description: 'EmailJS service ID for contact form functionality',
    placeholderValues: ['service_placeholder', 'your_service_id_here']
  },
  {
    key: 'VITE_EMAILJS_TEMPLATE_ID',
    required: true,
    description: 'EmailJS template ID for contact form emails',
    placeholderValues: ['template_placeholder', 'your_template_id_here']
  },
  {
    key: 'VITE_EMAILJS_PUBLIC_KEY',
    required: true,
    description: 'EmailJS public key for client-side authentication',
    placeholderValues: ['public_key_placeholder', 'your_public_key_here']
  }
]

function loadEnvFile(path: string): Record<string, string> {
  try {
    const envContent = readFileSync(path, 'utf-8')
    const env: Record<string, string> = {}
    
    envContent.split('\n').forEach(line => {
      const trimmed = line.trim()
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=')
        if (key && valueParts.length > 0) {
          env[key.trim()] = valueParts.join('=').trim()
        }
      }
    })
    
    return env
  } catch {
    return {}
  }
}

function validateEnvironment(): { isValid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = []
  const warnings: string[] = []
  
  // Load environment variables from .env file and process.env
  const envFile = loadEnvFile(join(process.cwd(), '.env'))
  const allEnv = { ...envFile, ...process.env }
  
  console.log('🔍 Validating environment variables...\n')
  
  for (const validation of ENV_VALIDATIONS) {
    const value = allEnv[validation.key]
    
    if (!value) {
      if (validation.required) {
        errors.push(`❌ ${validation.key} is required but not set`)
        console.log(`   Description: ${validation.description}`)
      } else {
        warnings.push(`⚠️  ${validation.key} is not set (optional)`)
      }
      continue
    }
    
    // Check for placeholder values
    if (validation.placeholderValues && validation.placeholderValues.includes(value)) {
      errors.push(`❌ ${validation.key} contains placeholder value: "${value}"`)
      console.log(`   Description: ${validation.description}`)
      console.log(`   Please update with your actual value`)
      continue
    }
    
    console.log(`✅ ${validation.key} is properly configured`)
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}

function main() {
  console.log('🚀 Portfolio Environment Validation\n')
  
  const result = validateEnvironment()
  
  if (result.warnings.length > 0) {
    console.log('\n⚠️  Warnings:')
    result.warnings.forEach(warning => console.log(`   ${warning}`))
  }
  
  if (result.errors.length > 0) {
    console.log('\n❌ Validation failed:')
    result.errors.forEach(error => console.log(`   ${error}`))
    console.log('\n📖 For setup instructions, see EMAILJS_SETUP.md')
    process.exit(1)
  }
  
  console.log('\n✅ All environment variables are properly configured!')
  console.log('🎉 Ready for production build!')
}

// Run validation if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}

export { validateEnvironment, ENV_VALIDATIONS }
