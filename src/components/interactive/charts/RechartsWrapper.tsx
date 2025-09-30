import React from 'react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer
} from 'recharts'
import type { RechartsConfig } from '../../../types'
import BaseChart from './BaseChart'

interface RechartsWrapperProps {
  config: RechartsConfig
  data: Record<string, string | number | boolean | null>[]
  loading?: boolean
  error?: string | null
  className?: string
}

const RechartsWrapper: React.FC<RechartsWrapperProps> = ({
  config,
  data,
  loading,
  error,
  className
}) => {
  const defaultColors = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']
  const colors = config.colors || defaultColors

  const renderChart = () => {
    const commonProps = {
      data,
      margin: { top: 5, right: 30, left: 20, bottom: 32 }
    }

    const renderXAxis = () => (
      <XAxis 
        dataKey={config.xAxisKey}
        stroke="#9ca3af"
        fontSize={12}
        tickLine={false}
        axisLine={false}
        label={config.xAxisLabel ? { value: config.xAxisLabel, position: 'insideBottom', offset: 12, style: { textAnchor: 'middle', fill: '#9ca3af' } } : undefined}
      />
    )

    const computePercentDomain = (): [number, number] | undefined => {
      const keys = Array.isArray(config.yAxisKey) ? config.yAxisKey : [config.yAxisKey]
      let min = Number.POSITIVE_INFINITY
      let max = Number.NEGATIVE_INFINITY
      data.forEach(row => {
        keys.forEach(k => {
          const rawValue = row[k as keyof typeof row]
          const numericValue = typeof rawValue === 'number'
            ? rawValue
            : typeof rawValue === 'string'
              ? Number(rawValue)
              : Number.NaN

          if (!Number.isNaN(numericValue)) {
            if (numericValue < min) min = numericValue
            if (numericValue > max) max = numericValue
          }
        })
      })
      if (min >= 0 && max <= 100 && min !== Number.POSITIVE_INFINITY) return [0, 100]
      return undefined
    }

    const renderYAxis = () => {
      const percentDomain = computePercentDomain()

      return (
        <YAxis
          stroke="#9ca3af"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          {...(percentDomain ? { domain: percentDomain } : {})}
          label={config.yAxisLabel ? { value: config.yAxisLabel, angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#9ca3af' } } : undefined}
          tickFormatter={(value) => {
            if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
            if (value >= 1000) return `${(value / 1000).toFixed(1)}K`
            return value.toString()
          }}
        />
      )
    }

    const renderGrid = () => config.showGrid !== false ? (
      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
    ) : null

    // Disable tooltips to prevent grey shadow effect
    const renderTooltip = () => null

    const renderLegend = () => config.showLegend !== false ? (
      <Legend
        verticalAlign="top"
        align="right"
        iconType="circle"
        wrapperStyle={{ color: '#9ca3af', paddingTop: 8 }}
      />
    ) : null

    switch (config.chartType) {
      case 'line':
        return (
          <LineChart {...commonProps}>
            {renderGrid()}
            {renderXAxis()}
            {renderYAxis()}
            {renderTooltip()}
            {renderLegend()}
            {Array.isArray(config.yAxisKey) ? (
              config.yAxisKey.map((key, index) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={colors[index % colors.length]}
                  strokeWidth={2}
                  dot={{ fill: colors[index % colors.length], strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              ))
            ) : (
              <Line
                type="monotone"
                dataKey={config.yAxisKey}
                stroke={colors[0]}
                strokeWidth={2}
                dot={{ fill: colors[0], strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            )}
          </LineChart>
        )

      case 'bar':
        return (
          <BarChart {...commonProps}>
            {renderGrid()}
            {renderXAxis()}
            {renderYAxis()}
            {renderTooltip()}
            {renderLegend()}
            {Array.isArray(config.yAxisKey) ? (
              config.yAxisKey.map((key, index) => (
                <Bar
                  key={key}
                  dataKey={key}
                  fill={colors[index % colors.length]}
                  radius={[4, 4, 0, 0]}
                />
              ))
            ) : (
              <Bar
                dataKey={config.yAxisKey}
                fill={colors[0]}
                radius={[4, 4, 0, 0]}
              />
            )}
          </BarChart>
        )

      case 'area':
        return (
          <AreaChart {...commonProps}>
            {renderGrid()}
            {renderXAxis()}
            {renderYAxis()}
            {renderTooltip()}
            {renderLegend()}
            {Array.isArray(config.yAxisKey) ? (
              config.yAxisKey.map((key, index) => (
                <Area
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stackId="1"
                  stroke={colors[index % colors.length]}
                  fill={colors[index % colors.length]}
                  fillOpacity={0.6}
                />
              ))
            ) : (
              <Area
                type="monotone"
                dataKey={config.yAxisKey}
                stroke={colors[0]}
                fill={colors[0]}
                fillOpacity={0.6}
              />
            )}
          </AreaChart>
        )

      case 'scatter':
        return (
          <ScatterChart {...commonProps}>
            {renderGrid()}
            {renderXAxis()}
            {renderYAxis()}
            {renderTooltip()}
            {renderLegend()}
            <Scatter
              dataKey={Array.isArray(config.yAxisKey) ? config.yAxisKey[0] : config.yAxisKey}
              fill={colors[0]}
            />
          </ScatterChart>
        )

      case 'pie':
        return (
          <PieChart width={400} height={300}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={(entry: { name?: string; percent?: number }) =>
                entry.name && entry.percent ? `${entry.name} ${(entry.percent * 100).toFixed(0)}%` : ''
              }
              outerRadius={80}
              fill="#8884d8"
              dataKey={Array.isArray(config.yAxisKey) ? config.yAxisKey[0] : config.yAxisKey}
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            {renderTooltip()}
            {renderLegend()}
          </PieChart>
        )

      default:
        return <div className="text-light-gray">Unsupported chart type: {config.chartType}</div>
    }
  }

  return (
    <BaseChart
      config={config}
      data={data}
      loading={loading}
      error={error}
      className={className}
    >
      <div
        style={{ width: '100%', height: config.height || 300, minHeight: config.height || 300 }}
        className="recharts-container-wrapper"
      >
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </BaseChart>
  )
}

export default RechartsWrapper
