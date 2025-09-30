/**
 * Client-side rate limiting and bot protection utilities
 */

interface RateLimitEntry {
  count: number
  firstAttempt: number
  lastAttempt: number
}

class RateLimiter {
  private storage: Storage
  private keyPrefix: string

  constructor(storage: Storage = localStorage, keyPrefix: string = 'contact_rate_limit') {
    this.storage = storage
    this.keyPrefix = keyPrefix
  }

  /**
   * Check if user has exceeded rate limits
   * @param identifier - User identifier (IP would be ideal, but we'll use a browser fingerprint)
   * @param maxAttempts - Maximum attempts allowed
   * @param windowMs - Time window in milliseconds
   * @returns true if rate limit exceeded
   */
  isRateLimited(identifier: string, maxAttempts: number = 3, windowMs: number = 60000): boolean {
    const key = `${this.keyPrefix}_${identifier}`
    const now = Date.now()
    
    try {
      const stored = this.storage.getItem(key)
      if (!stored) {
        // First attempt
        this.storage.setItem(key, JSON.stringify({
          count: 1,
          firstAttempt: now,
          lastAttempt: now
        }))
        return false
      }

      const entry: RateLimitEntry = JSON.parse(stored)
      
      // Check if window has expired
      if (now - entry.firstAttempt > windowMs) {
        // Reset counter
        this.storage.setItem(key, JSON.stringify({
          count: 1,
          firstAttempt: now,
          lastAttempt: now
        }))
        return false
      }

      // Check if rate limit exceeded
      if (entry.count >= maxAttempts) {
        return true
      }

      // Increment counter
      entry.count++
      entry.lastAttempt = now
      this.storage.setItem(key, JSON.stringify(entry))
      
      return false
    } catch (error) {
      console.warn('Rate limiter error:', error)
      return false // Fail open
    }
  }

  /**
   * Get remaining attempts
   */
  getRemainingAttempts(identifier: string, maxAttempts: number = 3): number {
    const key = `${this.keyPrefix}_${identifier}`
    
    try {
      const stored = this.storage.getItem(key)
      if (!stored) return maxAttempts

      const entry: RateLimitEntry = JSON.parse(stored)
      return Math.max(0, maxAttempts - entry.count)
    } catch {
      return maxAttempts
    }
  }

  /**
   * Get time until rate limit resets
   */
  getResetTime(identifier: string, windowMs: number = 60000): number {
    const key = `${this.keyPrefix}_${identifier}`
    
    try {
      const stored = this.storage.getItem(key)
      if (!stored) return 0

      const entry: RateLimitEntry = JSON.parse(stored)
      const resetTime = entry.firstAttempt + windowMs
      return Math.max(0, resetTime - Date.now())
    } catch {
      return 0
    }
  }
}

/**
 * Generate a simple browser fingerprint for rate limiting
 */
export function getBrowserFingerprint(): string {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.textBaseline = 'top'
    ctx.font = '14px Arial'
    ctx.fillText('Browser fingerprint', 2, 2)
  }
  
  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    screen.width + 'x' + screen.height,
    new Date().getTimezoneOffset(),
    canvas.toDataURL()
  ].join('|')
  
  // Simple hash function
  let hash = 0
  for (let i = 0; i < fingerprint.length; i++) {
    const char = fingerprint.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  
  return Math.abs(hash).toString(36)
}

export const rateLimiter = new RateLimiter()
