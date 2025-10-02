import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { PaperAirplaneIcon } from '@heroicons/react/24/outline'
import emailjs from '@emailjs/browser'
import { getEmailJSConfig, isDevelopment } from '../../utils/env'
import { rateLimiter, getBrowserFingerprint } from '../../utils/rateLimiter'
import { BotDetector, validateHoneypot, detectSpamContent, validateEmailStrict } from '../../utils/botProtection'
import { contactFormValidation, realTimeValidators } from '../../utils/validation'
import { sanitizeFormData, validateSanitizedData } from '../../utils/sanitization'
import { ValidatedInput } from '../ui/ValidatedInput'

interface FormData {
  fullName: string
  email: string
  company: string
  message: string
  honeypot?: string // Hidden field for bot detection
}

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error' | 'rate_limited' | 'spam_detected'>('idle')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const botDetectorRef = useRef<BotDetector | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormData>()

  // Initialize bot detector on component mount
  useEffect(() => {
    botDetectorRef.current = new BotDetector()
  }, [])

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    setSubmitStatus('idle')
    setErrorMessage('')

    try {
      // 1. Sanitize input data
      const sanitizedData = sanitizeFormData(data)

      // 2. Validate sanitized data
      const sanitizationValidation = validateSanitizedData(sanitizedData)
      if (!sanitizationValidation.isValid) {
        console.warn('Sanitization validation failed:', sanitizationValidation.errors)
        setErrorMessage('Invalid input detected. Please check your message and try again.')
        setSubmitStatus('error')
        return
      }

      // 3. Honeypot validation (bot detection)
      if (!validateHoneypot(data.honeypot || '')) {
        console.warn('Honeypot triggered - likely bot submission')
        setSubmitStatus('spam_detected')
        return
      }

      // 4. Rate limiting check
      const fingerprint = getBrowserFingerprint()
      if (rateLimiter.isRateLimited(fingerprint, 3, 300000)) { // 3 attempts per 5 minutes
        const resetTime = rateLimiter.getResetTime(fingerprint, 300000)
        const minutes = Math.ceil(resetTime / 60000)
        setErrorMessage(`Too many attempts. Please wait ${minutes} minute(s) before trying again.`)
        setSubmitStatus('rate_limited')
        return
      }

      // 5. Bot behavior detection
      if (botDetectorRef.current?.isLikelyBot()) {
        console.warn('Bot-like behavior detected')
        setSubmitStatus('spam_detected')
        return
      }

      // 6. Email validation (use sanitized data)
      if (!validateEmailStrict(sanitizedData.email)) {
        setErrorMessage('Please enter a valid email address.')
        setSubmitStatus('error')
        return
      }

      // 7. Spam content detection (use sanitized data)
      const fullText = `${sanitizedData.fullName} ${sanitizedData.company} ${sanitizedData.message}`
      if (detectSpamContent(fullText)) {
        console.warn('Spam content detected')
        setSubmitStatus('spam_detected')
        return
      }

      // 8. Get validated EmailJS configuration
      const emailConfig = getEmailJSConfig()

      // Check if EmailJS is properly configured
      if (!emailConfig) {
        if (isDevelopment()) {
          console.warn('EmailJS not configured. Form data:', sanitizedData)
          // Simulate success for demo purposes in development
          await new Promise(resolve => setTimeout(resolve, 2000))
          setSubmitStatus('success')
          reset()
          return
        } else {
          // In production, show error if not configured
          throw new Error('Email service is not properly configured. Please contact the site administrator.')
        }
      }

      // 9. Send email using EmailJS (use sanitized data)
      const templateParams = {
        from_name: sanitizedData.fullName,
        from_email: sanitizedData.email,
        company: sanitizedData.company,
        message: sanitizedData.message,
        to_name: 'Franck', // Your name
      }

      await emailjs.send(
        emailConfig.serviceId,
        emailConfig.templateId,
        templateParams,
        emailConfig.publicKey
      )

      setSubmitStatus('success')
      reset()
    } catch (error) {
      console.error('Email sending failed:', error)
      setErrorMessage(error instanceof Error ? error.message : 'Failed to send message. Please try again.')
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="space-y-8" aria-labelledby="contact-title">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 id="contact-title" className="page-title text-left">Contact</h2>
        
        <div className="h-0.5 w-16 bg-orange-yellow mb-6"></div>
      </motion.div>

      {/* Contact Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Left side - Content */}
          <div className="flex-1">
            <div className="mb-8">
              <h3 className="subsection-heading mb-3">Let's Connect</h3>
              <p className="body-normal">
                Interested in working together? I'd love to discuss how I can help drive results for your organization.
              </p>
            </div>

            <div className="mb-8">

              {/* Info cards side by side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center p-4 bg-eerie-black-2/90 rounded-lg border border-white/10 shadow-sm">
                  <h4 className="small-heading text-orange-yellow mb-1">Languages</h4>
                  <p className="body-small text-white-1">English, German, French</p>
                </div>
                <div className="text-center p-4 bg-eerie-black-2/90 rounded-lg border border-white/10 shadow-sm">
                  <h4 className="small-heading text-orange-yellow mb-1">Curriculum Vitae</h4>
                  <p className="body-small text-white-1">Upon Request</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
            <fieldset disabled={isSubmitting} className="space-y-6">
              <legend className="sr-only">Contact Form</legend>

            {/* Honeypot field - hidden from users but visible to bots */}
            <div style={{ position: 'absolute', left: '-9999px', opacity: 0, pointerEvents: 'none' }}>
              <input
                {...register('honeypot')}
                type="text"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />
            </div>

          <ValidatedInput
            label="Full Name"
            type="text"
            placeholder="Full name"
            register={register('fullName', contactFormValidation.fullName)}
            error={errors.fullName}
            maxLength={100}
            showCharacterCount={false}
            realTimeValidation={realTimeValidators.validateNameRealTime}
          />

          <ValidatedInput
            label="Email Address"
            type="email"
            placeholder="Email address"
            register={register('email', contactFormValidation.email)}
            error={errors.email}
            maxLength={254}
            showCharacterCount={false}
            realTimeValidation={realTimeValidators.validateEmailRealTime}
          />

          <ValidatedInput
            label="Company/Organization"
            type="text"
            placeholder="Company/Organization"
            register={register('company', contactFormValidation.company)}
            error={errors.company}
            maxLength={200}
            showCharacterCount={false}
            realTimeValidation={realTimeValidators.validateCompanyRealTime}
          />

          <ValidatedInput
            label="Message"
            type="textarea"
            placeholder="Your Message"
            register={register('message', contactFormValidation.message)}
            error={errors.message}
            maxLength={2000}
            rows={6}
            showCharacterCount={true}
            realTimeValidation={realTimeValidators.validateMessageRealTime}
            className="resize-none"
          />

            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="nav-text w-full bg-orange-yellow text-eerie-black-1 py-3 px-6 rounded-lg hover:bg-vegas-gold transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-orange-yellow focus:ring-offset-2 focus:ring-offset-eerie-black-1"
              aria-describedby={submitStatus !== 'idle' ? 'form-status' : undefined}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-eerie-black-1/30 border-t-eerie-black-1 rounded-full animate-spin" aria-hidden="true" />
                  <span>Sending...</span>
                  <span className="sr-only">Please wait while your message is being sent</span>
                </>
              ) : (
                <>
                  <PaperAirplaneIcon className="w-4 h-4" aria-hidden="true" />
                  Start the Conversation
                </>
              )}
            </motion.button>
          </fieldset>

          {/* Status Messages with ARIA live regions */}
          <div id="form-status" aria-live="polite" aria-atomic="true">
            {submitStatus === 'success' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="body-small bg-green-500/20 border border-green-500/30 text-green-400 p-3 rounded-lg"
                role="status"
              >
                Thank you for your message! It has been sent successfully. I'll get back to you soon.
              </motion.div>
            )}

            {submitStatus === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="body-small bg-red-500/20 border border-red-500/30 text-red-400 p-3 rounded-lg"
                role="alert"
              >
                {errorMessage || 'Failed to send message. Please try again or contact me directly at franck@aethelstone.com.'}
              </motion.div>
            )}

            {submitStatus === 'rate_limited' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="body-small bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 p-3 rounded-lg"
                role="alert"
              >
                {errorMessage}
              </motion.div>
            )}

            {submitStatus === 'spam_detected' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="body-small bg-orange-500/20 border border-orange-500/30 text-orange-400 p-3 rounded-lg"
                role="alert"
              >
                Your message couldn't be sent. Please ensure your message is appropriate and try again.
              </motion.div>
            )}
          </div>
        </form>
      </motion.div>
    </section>
  )
}

export default Contact
