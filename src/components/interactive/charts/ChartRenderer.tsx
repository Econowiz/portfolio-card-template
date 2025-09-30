import React, { useState, useEffect, Suspense } from 'react'
import type { ChartConfig } from '../../../types'
import BaseChart from './BaseChart'
const RechartsWrapper = React.lazy(() => import('./RechartsWrapper'))
const PlotlyWrapper = React.lazy(() => import('./PlotlyWrapper'))
// import NivoWrapper from './NivoWrapper' // We'll create this next

interface ChartRendererProps {
  config: ChartConfig
  data?: Record<string, string | number | boolean | null>[]
  dataSource?: string
  loading?: boolean
  error?: string | null
  className?: string
}

const ChartRenderer: React.FC<ChartRendererProps> = ({
  config,
  data: providedData,
  dataSource,
  loading: providedLoading = false,
  error: providedError = null,
  className
}) => {
  const [data, setData] = useState<Record<string, string | number | boolean | null>[]>(providedData || [])
  const [loading, setLoading] = useState(providedLoading)
  const [error, setError] = useState<string | null>(providedError)

  // Load data from dataSource if provided
  useEffect(() => {
    if (dataSource && !providedData) {
      setLoading(true)
      setError(null)
      
      fetch(dataSource)
        .then(response => {
          if (!response.ok) {
            throw new Error(`Failed to load data: ${response.statusText}`)
          }
          return response.json()
        })
        .then(data => {
          setData(Array.isArray(data) ? data : [data])
          setLoading(false)
        })
        .catch(err => {
          setError(err.message)
          setLoading(false)
        })
    } else if (providedData) {
      setData(providedData)
    }
  }, [dataSource, providedData])

  // Update loading and error states when props change
  useEffect(() => {
    setLoading(providedLoading)
  }, [providedLoading])

  useEffect(() => {
    setError(providedError)
  }, [providedError])

  const renderChart = () => {
    switch (config.library) {
      case 'recharts':
        return (
          <Suspense fallback={
            <BaseChart config={config} data={data} loading={true} error={null} className={className}>
              <div />
            </BaseChart>
          }>
            <RechartsWrapper
              config={config}
              data={data}
              loading={loading}
              error={error}
              className={className}
            />
          </Suspense>
        )
      
      case 'plotly':
        return (
          <Suspense fallback={
            <BaseChart config={config} data={data} loading={true} error={null} className={className}>
              <div />
            </BaseChart>
          }>
            <PlotlyWrapper
              config={config}
              data={data}
              loading={loading}
              error={error}
              className={className}
            />
          </Suspense>
        )
      
      // case 'nivo':
      //   return (
      //     <NivoWrapper
      //       config={config}
      //       data={data}
      //       loading={loading}
      //       error={error}
      //       className={className}
      //     />
      //   )
      
      default:
        return (
          <div className={`bg-gradient-jet p-6 rounded-xl border border-jet ${className}`}>
            <div className="text-center py-8">
              <div className="text-red-400 mb-2">⚠️ Unsupported Chart Library</div>
              <div className="text-light-gray text-sm">
                Chart library "{config.library}" is not supported
              </div>
            </div>
          </div>
        )
    }
  }

  return renderChart()
}

export default ChartRenderer
