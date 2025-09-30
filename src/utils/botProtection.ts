/**
 * Bot protection utilities
 */

/**
 * Simple bot detection based on form interaction patterns
 */
export class BotDetector {
  private startTime: number
  private interactions: number = 0
  private mouseMovements: number = 0
  private keystrokes: number = 0

  constructor() {
    this.startTime = Date.now()
    this.setupEventListeners()
  }

  private setupEventListeners() {
    // Track mouse movements
    document.addEventListener('mousemove', () => {
      this.mouseMovements++
    }, { passive: true })

    // Track keystrokes
    document.addEventListener('keydown', () => {
      this.keystrokes++
    }, { passive: true })

    // Track form interactions
    document.addEventListener('focus', (e) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        this.interactions++
      }
    }, true)
  }

  /**
   * Analyze if submission looks like a bot
   * @returns true if likely a bot
   */
  isLikelyBot(): boolean {
    const timeSpent = Date.now() - this.startTime
    
    // Red flags for bots:
    // 1. Submitted too quickly (less than 3 seconds)
    // 2. No mouse movements
    // 3. No keystrokes (copy-paste only)
    // 4. No form field interactions
    
    if (timeSpent < 3000) return true // Too fast
    if (this.mouseMovements === 0) return true // No mouse activity
    if (this.keystrokes === 0 && this.interactions === 0) return true // No human interaction
    
    return false
  }

  /**
   * Get interaction score (higher = more human-like)
   */
  getInteractionScore(): number {
    const timeSpent = Math.min(Date.now() - this.startTime, 300000) // Cap at 5 minutes
    const timeScore = Math.min(timeSpent / 10000, 10) // 0-10 based on time
    const mouseScore = Math.min(this.mouseMovements / 10, 10) // 0-10 based on mouse activity
    const keystrokeScore = Math.min(this.keystrokes / 5, 10) // 0-10 based on typing
    const interactionScore = Math.min(this.interactions * 2, 10) // 0-10 based on field focus
    
    return (timeScore + mouseScore + keystrokeScore + interactionScore) / 4
  }
}

/**
 * Validate honeypot field (should be empty)
 */
export function validateHoneypot(value: string): boolean {
  return value === '' || value === undefined || value === null
}

/**
 * Simple spam content detection
 */
export function detectSpamContent(text: string): boolean {
  const spamPatterns = [
    /\b(viagra|cialis|pharmacy|casino|poker|lottery|winner|congratulations)\b/i,
    /\b(click here|visit now|act now|limited time|urgent|immediate)\b/i,
    /\b(make money|earn \$|guaranteed|risk-free|no obligation)\b/i,
    /(https?:\/\/[^\s]+){3,}/i, // Multiple URLs
    /(.)\1{10,}/, // Repeated characters
    /[A-Z]{20,}/, // Too much caps
  ]
  
  return spamPatterns.some(pattern => pattern.test(text))
}

/**
 * Validate email format more strictly
 */
export function validateEmailStrict(email: string): boolean {
  // More strict email validation
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
  
  if (!emailRegex.test(email)) return false
  
  // Check for suspicious patterns
  const suspiciousPatterns = [
    /\+.*\+/, // Multiple + signs
    /\.{2,}/, // Multiple dots
    /@.*@/, // Multiple @ signs
    /^[0-9]+@/, // Starts with numbers only
  ]
  
  return !suspiciousPatterns.some(pattern => pattern.test(email))
}
