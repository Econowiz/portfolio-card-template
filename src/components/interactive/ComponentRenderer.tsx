import React from 'react'
import type { InteractiveComponent, ChartConfig, CalculatorConfig, DashboardComponent } from '../../types'
import { ChartRenderer } from './charts'
import { BaseCalculator } from './calculators'
import Dashboard from './Dashboard'

interface ComponentRendererProps {
  component: InteractiveComponent
  data?: Record<string, string | number | boolean | null>[]
  className?: string
}

const ComponentRenderer: React.FC<ComponentRendererProps> = ({
  component,
  data,
  className
}) => {
  const { type, config, dataSource } = component

  switch (type) {
    case 'chart': {
      const chartConfig = config as ChartConfig
      return (
        <ChartRenderer
          config={chartConfig}
          data={data}
          dataSource={dataSource}
          className={className}
        />
      )
    }

    case 'calculator': {
      const calculatorConfig = config as CalculatorConfig
      
      // Always use BaseCalculator for ROI to respect custom configurations
      return (
        <BaseCalculator
          config={calculatorConfig}
          className={className}
        />
      )
    }

    case 'dashboard': {
      const dashboardComponent = component as DashboardComponent
      return (
        <Dashboard
          component={dashboardComponent}
          className={className}
        />
      )
    }

    case 'simulation':
      // Simulation component will be implemented later
      return (
        <div className={`bg-gradient-jet p-6 rounded-xl border border-jet ${className}`}>
          <div className="text-center py-8">
            <div className="text-orange-yellow mb-2">🚧 Simulation Component</div>
            <div className="text-light-gray text-sm">
              Simulation components are coming soon
            </div>
          </div>
        </div>
      )

    case 'comparison':
      // Comparison component will be implemented later
      return (
        <div className={`bg-gradient-jet p-6 rounded-xl border border-jet ${className}`}>
          <div className="text-center py-8">
            <div className="text-orange-yellow mb-2">🚧 Comparison Component</div>
            <div className="text-light-gray text-sm">
              Comparison components are coming soon
            </div>
          </div>
        </div>
      )

    case 'table':
      // Table component will be implemented later
      return (
        <div className={`bg-gradient-jet p-6 rounded-xl border border-jet ${className}`}>
          <div className="text-center py-8">
            <div className="text-orange-yellow mb-2">🚧 Table Component</div>
            <div className="text-light-gray text-sm">
              Interactive table components are coming soon
            </div>
          </div>
        </div>
      )

    default:
      return (
        <div className={`bg-gradient-jet p-6 rounded-xl border border-jet ${className}`}>
          <div className="text-center py-8">
            <div className="text-red-400 mb-2">⚠️ Unknown Component Type</div>
            <div className="text-light-gray text-sm">
              Component type "{type}" is not supported
            </div>
          </div>
        </div>
      )
  }
}

export default ComponentRenderer
