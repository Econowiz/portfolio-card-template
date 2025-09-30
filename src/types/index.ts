// Export all types from the content module
export * from './content'

// Additional utility types for the portfolio system
export interface NavigationItem {
  id: string
  label: string
  path: string
  icon?: React.ComponentType<{ size?: number; className?: string }>
}

export interface Theme {
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    surface: string
    text: string
    textSecondary: string
    border: string
    success: string
    warning: string
    error: string
  }
  spacing: {
    xs: string
    sm: string
    md: string
    lg: string
    xl: string
  }
  borderRadius: {
    sm: string
    md: string
    lg: string
  }
}

// Component props interfaces
export interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
}

export interface LoadingState<T = unknown> {
  isLoading: boolean
  error?: string | null
  data?: T
}

// Data processing utilities
export interface DataProcessor<T = Record<string, unknown>, U = T> {
  parse: (data: unknown) => T[]
  validate: (data: T[]) => boolean
  transform: (data: T[]) => U[]
}

// Chart data interfaces
export interface ChartDataPoint {
  [key: string]: string | number | Date
}

export interface TimeSeriesData {
  date: Date | string
  value: number
  category?: string
}

export interface CategoryData {
  category: string
  value: number
  color?: string
}

// API response interfaces
export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
  error?: string
}

// Form interfaces
export interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'number' | 'select' | 'textarea' | 'checkbox'
  required?: boolean
  validation?: {
    pattern?: RegExp
    min?: number
    max?: number
    minLength?: number
    maxLength?: number
  }
  options?: { value: string; label: string }[]
}

export interface FormData {
  [key: string]: string | number | boolean | string[] | File | null
}

// Animation and transition types
export interface AnimationConfig {
  duration: number
  delay?: number
  easing?: string
  stagger?: number
}

export interface TransitionConfig {
  initial: Record<string, unknown>
  animate: Record<string, unknown>
  exit?: Record<string, unknown>
  transition?: AnimationConfig
}

// Error handling
export interface ErrorInfo {
  message: string
  code?: string | number
  details?: Record<string, unknown>
  timestamp?: Date
}

// Performance monitoring
export interface PerformanceMetrics {
  loadTime: number
  renderTime: number
  interactionTime: number
  memoryUsage?: number
}

// User preferences
export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto'
  animations: boolean
  compactMode: boolean
  defaultChartType: string
  language: string
}

// Export utility functions type definitions
export type DataFormatter = (value: string | number | boolean | null, format: string) => string
export type ColorGenerator = (index: number, total: number) => string
export type DataValidator = (data: unknown) => { isValid: boolean; errors: string[] }
