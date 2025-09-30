import React from 'react'
import { motion } from 'framer-motion'
import type { BaseChartConfig } from '../../../types'

interface BaseChartProps {
  config: BaseChartConfig
  data: Record<string, string | number | boolean | null>[]
  loading?: boolean
  error?: string | null
  className?: string
  children: React.ReactNode
}

const BaseChart: React.FC<BaseChartProps> = ({
  config,
  data,
  loading = false,
  error = null,
  className = '',
  children
}) => {
  if (loading) {
    return (
      <div className={`bg-gradient-jet p-6 rounded-xl border border-jet ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-jet rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-jet rounded"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`bg-gradient-jet p-6 rounded-xl border border-jet ${className}`}>
        <div className="text-center py-8">
          <div className="text-red-400 mb-2">⚠️ Error Loading Chart</div>
          <div className="text-light-gray text-sm">{error}</div>
        </div>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className={`bg-gradient-jet p-6 rounded-xl border border-jet ${className}`}>
        <div className="text-center py-8">
          <div className="text-light-gray mb-2">📊 No Data Available</div>
          <div className="text-light-gray text-sm">No data to display for this chart</div>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`bg-gradient-jet p-6 rounded-xl border border-jet ${className}`}
    >
      {config.title && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-white-1 mb-1">{config.title}</h3>
          {config.description && (
            <p className="text-light-gray text-sm">{config.description}</p>
          )}
        </div>
      )}
      
      <div 
        className="w-full"
        style={{
          height: config.height || 'auto',
          width: config.width || '100%'
        }}
      >
        {children}
      </div>
    </motion.div>
  )
}

export default BaseChart
