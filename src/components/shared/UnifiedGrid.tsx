import { motion } from 'framer-motion'
import { type ReactNode } from 'react'

interface UnifiedGridProps {
  children: ReactNode
  className?: string
}

const UnifiedGrid = ({ children, className = "" }: UnifiedGridProps) => {
  return (
    <motion.div
      role="list"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${className}`}
    >
      {children}
    </motion.div>
  )
}

export default UnifiedGrid