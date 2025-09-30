import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline'
import type { FieldError, UseFormRegisterReturn } from 'react-hook-form'

interface ValidatedInputProps {
  label: string
  type?: 'text' | 'email' | 'textarea'
  placeholder: string
  register: UseFormRegisterReturn
  error?: FieldError
  maxLength?: number
  rows?: number
  className?: string
  showCharacterCount?: boolean
  realTimeValidation?: (value: string) => string | boolean
}

export const ValidatedInput = ({
  label,
  type = 'text',
  placeholder,
  register,
  error,
  maxLength,
  rows,
  className = '',
  showCharacterCount = false,
  realTimeValidation
}: ValidatedInputProps) => {
  const [value, setValue] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [realTimeError, setRealTimeError] = useState<string | null>(null)
  const [isValid, setIsValid] = useState<boolean | null>(null)

  // Handle real-time validation
  useEffect(() => {
    if (realTimeValidation && value.length > 0) {
      const result = realTimeValidation(value)
      if (typeof result === 'string') {
        setRealTimeError(result)
        setIsValid(false)
      } else if (result === true) {
        setRealTimeError(null)
        setIsValid(true)
      } else {
        setRealTimeError(null)
        setIsValid(false)
      }
    } else if (value.length === 0) {
      setRealTimeError(null)
      setIsValid(null)
    }
  }, [value, realTimeValidation])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValue(e.target.value)
    register.onChange(e)
  }

  const getInputClassName = () => {
    let baseClass = `w-full bg-eerie-black-2 border rounded-lg px-4 py-3 text-white-1 placeholder-light-gray-70 focus:outline-none transition-all duration-300 ${className}`
    
    if (error || realTimeError) {
      baseClass += ' border-red-500/70 focus:border-red-500'
    } else if (isValid && value.length > 0) {
      baseClass += ' border-green-500/70 focus:border-green-500'
    } else if (isFocused) {
      baseClass += ' border-orange-yellow focus:border-orange-yellow'
    } else {
      baseClass += ' border-jet/70 focus:border-orange-yellow'
    }
    
    return baseClass
  }

  const getValidationIcon = () => {
    if (error || realTimeError) {
      return (
        <ExclamationCircleIcon className="w-5 h-5 text-red-400" />
      )
    } else if (isValid && value.length > 0) {
      return (
        <CheckCircleIcon className="w-5 h-5 text-green-400" />
      )
    }
    return null
  }

  const displayError = error?.message || realTimeError

  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={register.name} className="body-small block text-white-1">
          {label}
        </label>
      )}
      <div className="relative">
        {type === 'textarea' ? (
          <textarea
            {...register}
            id={register.name}
            placeholder={placeholder}
            rows={rows || 6}
            maxLength={maxLength}
            className={getInputClassName()}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChange={handleChange}
            aria-describedby={displayError ? `${register.name}-error` : undefined}
            aria-invalid={!!displayError}
          />
        ) : (
          <input
            {...register}
            id={register.name}
            type={type}
            placeholder={placeholder}
            maxLength={maxLength}
            className={getInputClassName()}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChange={handleChange}
            aria-describedby={displayError ? `${register.name}-error` : undefined}
            aria-invalid={!!displayError}
          />
        )}
        
        {/* Validation icon */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <AnimatePresence>
            {getValidationIcon() && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                {getValidationIcon()}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Character count */}
      {showCharacterCount && maxLength && (
        <div className="flex justify-end">
          <span className={`text-xs ${
            value.length > maxLength * 0.9 
              ? 'text-orange-400' 
              : value.length > maxLength * 0.8 
                ? 'text-yellow-400' 
                : 'text-light-gray-70'
          }`}>
            {value.length}/{maxLength}
          </span>
        </div>
      )}

      {/* Error message */}
      <AnimatePresence>
        {displayError && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <p 
              id={`${register.name}-error`} 
              className="text-red-400 text-sm flex items-center gap-2"
              role="alert"
            >
              <ExclamationCircleIcon className="w-4 h-4 flex-shrink-0" />
              {displayError}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success message for valid input */}
      <AnimatePresence>
        {isValid && value.length > 0 && !displayError && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <p className="text-green-400 text-sm flex items-center gap-2">
              <CheckCircleIcon className="w-4 h-4 flex-shrink-0" />
              Looks good!
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
