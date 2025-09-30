import React, { useMemo, useEffect, useState } from 'react'
import type { PlotData, Config, ModeBarDefaultButtons } from 'plotly.js'
import type { PlotParams } from 'react-plotly.js'
// Dynamic Plotly component will be created at runtime using the factory
import type { PlotlyConfig } from '../../../types'
import BaseChart from './BaseChart'

interface PlotlyWrapperProps {
  config: PlotlyConfig
  data: Record<string, string | number | boolean | null>[]
  loading?: boolean
  error?: string | null
  className?: string
}

const PlotlyWrapper: React.FC<PlotlyWrapperProps> = ({
  config,
  data,
  loading,
  error,
  className
}) => {
  const [PlotComponent, setPlotComponent] = useState<React.ComponentType<PlotParams> | null>(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const Plotly = (await import('plotly.js')).default

        const createPlotlyComponent = (await import('react-plotly.js/factory')).default as (p: unknown) => React.ComponentType<PlotParams>
        const Comp = createPlotlyComponent(Plotly)
        if (mounted) setPlotComponent(() => Comp)
      } catch (e) {
        // In case of unexpected dynamic import issues, do nothing; BaseChart will show error if provided
        console.error('Failed to load Plotly dynamically', e)
      }
    })()
    return () => { mounted = false }
  }, [config.traces])
  const plotData = useMemo(() => {
    return config.traces.map((trace, index) => {
      const traceData: Partial<PlotData> = {
        type: trace.type as unknown as PlotData['type'],
        mode: trace.mode as unknown as PlotData['mode'],
        name: trace.name || `Series ${index + 1}`,
        marker: trace.marker
      }

      // Handle data mapping
      if (typeof trace.x === 'string') {
        const xs = data.map(item => item[trace.x as string])
        traceData.x = xs.filter((v): v is string | number => typeof v === 'string' || typeof v === 'number')
      } else {
        traceData.x = trace.x as PlotData['x']
      }

      if (typeof trace.y === 'string') {
        const ys = data.map(item => item[trace.y as string])
        traceData.y = ys.filter((v): v is string | number => typeof v === 'string' || typeof v === 'number')
      } else {
        traceData.y = trace.y as PlotData['y']
      }

      if (trace.z && typeof trace.z === 'string') {
        const zs = data.map(item => item[trace.z as string])
        traceData.z = zs.filter((v): v is string | number => typeof v === 'string' || typeof v === 'number') as unknown as PlotData['z']
      } else if (trace.z) {
        traceData.z = trace.z as unknown as PlotData['z']
      }

      return traceData
    })
  }, [config.traces, data])

  const layout = useMemo(() => {
    const defaultLayout = {
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(0,0,0,0)',
      font: {
        color: '#f9fafb',
        family: 'Inter, system-ui, sans-serif'
      },
      xaxis: {
        gridcolor: '#374151',
        zerolinecolor: '#374151',
        color: '#9ca3af'
      },
      yaxis: {
        gridcolor: '#374151',
        zerolinecolor: '#374151',
        color: '#9ca3af'
      },
      margin: {
        l: 50,
        r: 50,
        t: 50,
        b: 50
      },
      showlegend: true,
      legend: {
        font: { color: '#9ca3af' },
        bgcolor: 'rgba(0,0,0,0)'
      }
    }

    return {
      ...defaultLayout,
      ...config.layout,
      title: config.title ? {
        text: config.title,
        font: { color: '#f9fafb', size: 16 },
        ...config.layout?.title
      } : undefined
    }
  }, [config.layout, config.title])

  const plotConfig: Partial<Config> = {
    displayModeBar: true,
    modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d'] as ModeBarDefaultButtons[],
    displaylogo: false,
    responsive: true
  }

  return (
    <BaseChart
      config={config}
      data={data}
      loading={loading || !PlotComponent}
      error={error}
      className={className}
    >
      {PlotComponent ? (
        <PlotComponent
          data={plotData}
          layout={layout}
          config={plotConfig}
          style={{ width: '100%', height: '100%' }}
          useResizeHandler={true}
        />
      ) : (
        <div />
      )}
    </BaseChart>
  )
}

export default PlotlyWrapper
