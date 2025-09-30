import React from 'react'
import BaseCalculator from './BaseCalculator'
import type { CalculatorConfig } from '../../../types'

interface ROICalculatorProps {
  title?: string
  description?: string
  className?: string
  onResultChange?: (result: number, additionalOutputs?: Record<string, number>) => void
}

const ROICalculator: React.FC<ROICalculatorProps> = ({
  title = "ROI Calculator",
  description = "Calculate return on investment for your projects",
  className,
  onResultChange
}) => {
  const config: CalculatorConfig = {
    type: 'roi',
    title,
    description,
    fields: [
      {
        id: 'initial_investment',
        label: 'Initial Investment',
        type: 'currency',
        defaultValue: 10000,
        min: 0,
        max: 10000000,
        step: 1000,
        description: 'Total upfront investment required'
      },
      {
        id: 'annual_savings',
        label: 'Annual Savings/Revenue',
        type: 'currency',
        defaultValue: 5000,
        min: 0,
        max: 5000000,
        step: 500,
        description: 'Expected annual savings or additional revenue'
      },
      {
        id: 'project_duration',
        label: 'Project Duration (Years)',
        type: 'number',
        defaultValue: 3,
        min: 1,
        max: 20,
        step: 1,
        description: 'Expected project lifespan in years'
      },
      {
        id: 'discount_rate',
        label: 'Discount Rate',
        type: 'percentage',
        defaultValue: 8,
        min: 0,
        max: 20,
        step: 0.5,
        description: 'Annual discount rate for NPV calculation'
      },
      {
        id: 'annual_costs',
        label: 'Annual Operating Costs',
        type: 'currency',
        defaultValue: 1000,
        min: 0,
        max: 1000000,
        step: 100,
        description: 'Ongoing annual costs (maintenance, support, etc.)'
      }
    ],
    formula: `
      (() => {
        const netAnnualBenefit = annual_savings - annual_costs;
        const discountRate = discount_rate / 100;
        let npv = -initial_investment;
        
        for (let year = 1; year <= project_duration; year++) {
          npv += netAnnualBenefit / Math.pow(1 + discountRate, year);
        }
        
        return (npv / initial_investment) * 100;
      })()
    `,
    resultFormat: 'percentage',
    resultLabel: 'Return on Investment (ROI)',
    additionalOutputs: [
      {
        id: 'npv',
        label: 'Net Present Value (NPV)',
        formula: `
          (() => {
            const netAnnualBenefit = annual_savings - annual_costs;
            const discountRate = discount_rate / 100;
            let npv = -initial_investment;
            
            for (let year = 1; year <= project_duration; year++) {
              npv += netAnnualBenefit / Math.pow(1 + discountRate, year);
            }
            
            return npv;
          })()
        `,
        format: 'currency'
      },
      {
        id: 'payback_period',
        label: 'Payback Period (Years)',
        formula: 'initial_investment / (annual_savings - annual_costs)',
        format: 'number'
      },
      {
        id: 'total_savings',
        label: 'Total Savings Over Duration',
        formula: '(annual_savings - annual_costs) * project_duration',
        format: 'currency'
      },
      {
        id: 'break_even_point',
        label: 'Break-even Point (Months)',
        formula: '(initial_investment / (annual_savings - annual_costs)) * 12',
        format: 'number'
      }
    ]
  }

  return (
    <BaseCalculator
      config={config}
      className={className}
      onResultChange={onResultChange}
    />
  )
}

export default ROICalculator
