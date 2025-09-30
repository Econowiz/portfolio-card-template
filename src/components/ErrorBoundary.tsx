import React, { Component } from 'react'
import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log to console for debugging
    console.error('Error caught by boundary:', error, errorInfo)
  }

  private handleRetry = () => {
    this.setState({ hasError: false })
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI provided
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Simple default fallback UI
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center p-8 text-center"
        >
          <AlertTriangle className="w-12 h-12 text-orange-yellow mb-4" />
          <h2 className="text-xl font-bold text-white-1 mb-2">Something went wrong</h2>
          <p className="text-light-gray mb-4">
            This section encountered an error. Please try again.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={this.handleRetry}
            className="flex items-center gap-2 px-4 py-2 bg-orange-yellow text-eerie-black-1 rounded font-medium hover:bg-orange-yellow/90 transition-colors"
          >
            <RefreshCw size={16} />
            Try Again
          </motion.button>
        </motion.div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
