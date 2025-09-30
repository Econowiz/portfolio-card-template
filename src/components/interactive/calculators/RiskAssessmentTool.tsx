import React from 'react'
import BaseCalculator from './BaseCalculator'
import type { CalculatorConfig } from '../../../types'

interface RiskAssessmentToolProps {
  title?: string
  description?: string
  className?: string
  onResultChange?: (result: number, additionalOutputs?: Record<string, number>) => void
}

const RiskAssessmentTool: React.FC<RiskAssessmentToolProps> = ({
  title = "Risk Assessment Tool",
  description = "Evaluate project risk factors and calculate overall risk score",
  className,
  onResultChange
}) => {
  const config: CalculatorConfig = {
    type: 'risk-assessment',
    title,
    description,
    fields: [
      {
        id: 'technical_complexity',
        label: 'Technical Complexity',
        type: 'select',
        defaultValue: 3,
        options: [
          { value: 1, label: 'Low - Simple implementation' },
          { value: 2, label: 'Low-Medium - Some complexity' },
          { value: 3, label: 'Medium - Moderate complexity' },
          { value: 4, label: 'Medium-High - Complex implementation' },
          { value: 5, label: 'High - Very complex' }
        ],
        description: 'How technically complex is the project?'
      },
      {
        id: 'team_experience',
        label: 'Team Experience Level',
        type: 'select',
        defaultValue: 3,
        options: [
          { value: 1, label: 'Expert - Extensive experience' },
          { value: 2, label: 'Advanced - Good experience' },
          { value: 3, label: 'Intermediate - Some experience' },
          { value: 4, label: 'Beginner - Limited experience' },
          { value: 5, label: 'Novice - No experience' }
        ],
        description: 'What is the team\'s experience level with similar projects?'
      },
      {
        id: 'project_size',
        label: 'Project Size',
        type: 'select',
        defaultValue: 2,
        options: [
          { value: 1, label: 'Small - < 3 months' },
          { value: 2, label: 'Medium - 3-6 months' },
          { value: 3, label: 'Large - 6-12 months' },
          { value: 4, label: 'Very Large - 1-2 years' },
          { value: 5, label: 'Enterprise - > 2 years' }
        ],
        description: 'What is the expected project duration?'
      },
      {
        id: 'stakeholder_alignment',
        label: 'Stakeholder Alignment',
        type: 'select',
        defaultValue: 2,
        options: [
          { value: 1, label: 'Excellent - Full alignment' },
          { value: 2, label: 'Good - Mostly aligned' },
          { value: 3, label: 'Fair - Some disagreement' },
          { value: 4, label: 'Poor - Significant disagreement' },
          { value: 5, label: 'Very Poor - No alignment' }
        ],
        description: 'How well aligned are stakeholders on project goals?'
      },
      {
        id: 'resource_availability',
        label: 'Resource Availability',
        type: 'select',
        defaultValue: 2,
        options: [
          { value: 1, label: 'Excellent - All resources available' },
          { value: 2, label: 'Good - Most resources available' },
          { value: 3, label: 'Fair - Some resource constraints' },
          { value: 4, label: 'Poor - Limited resources' },
          { value: 5, label: 'Very Poor - Severe constraints' }
        ],
        description: 'How available are the required resources?'
      },
      {
        id: 'external_dependencies',
        label: 'External Dependencies',
        type: 'select',
        defaultValue: 2,
        options: [
          { value: 1, label: 'None - Fully self-contained' },
          { value: 2, label: 'Few - Minimal dependencies' },
          { value: 3, label: 'Some - Moderate dependencies' },
          { value: 4, label: 'Many - Significant dependencies' },
          { value: 5, label: 'Critical - High dependency risk' }
        ],
        description: 'How dependent is the project on external factors?'
      },
      {
        id: 'change_likelihood',
        label: 'Likelihood of Scope Changes',
        type: 'select',
        defaultValue: 3,
        options: [
          { value: 1, label: 'Very Low - Stable requirements' },
          { value: 2, label: 'Low - Minor changes expected' },
          { value: 3, label: 'Medium - Some changes likely' },
          { value: 4, label: 'High - Frequent changes expected' },
          { value: 5, label: 'Very High - Constantly changing' }
        ],
        description: 'How likely are scope or requirement changes?'
      }
    ],
    formula: `
      (() => {
        const factors = [
          technical_complexity,
          team_experience,
          project_size,
          stakeholder_alignment,
          resource_availability,
          external_dependencies,
          change_likelihood
        ];
        
        const totalScore = factors.reduce((sum, factor) => sum + factor, 0);
        const maxScore = factors.length * 5;
        
        return (totalScore / maxScore) * 100;
      })()
    `,
    resultFormat: 'percentage',
    resultLabel: 'Overall Risk Score',
    additionalOutputs: [
      {
        id: 'risk_level',
        label: 'Risk Level',
        formula: `
          (() => {
            const factors = [
              technical_complexity,
              team_experience,
              project_size,
              stakeholder_alignment,
              resource_availability,
              external_dependencies,
              change_likelihood
            ];
            
            const totalScore = factors.reduce((sum, factor) => sum + factor, 0);
            const avgScore = totalScore / factors.length;
            
            if (avgScore <= 2) return 1; // Low
            if (avgScore <= 3) return 2; // Medium
            if (avgScore <= 4) return 3; // High
            return 4; // Very High
          })()
        `,
        format: 'number'
      },
      {
        id: 'mitigation_priority',
        label: 'Mitigation Priority Score',
        formula: `
          (() => {
            const highRiskFactors = [
              technical_complexity >= 4 ? 1 : 0,
              team_experience >= 4 ? 1 : 0,
              project_size >= 4 ? 1 : 0,
              stakeholder_alignment >= 4 ? 1 : 0,
              resource_availability >= 4 ? 1 : 0,
              external_dependencies >= 4 ? 1 : 0,
              change_likelihood >= 4 ? 1 : 0
            ].reduce((sum, factor) => sum + factor, 0);
            
            return highRiskFactors;
          })()
        `,
        format: 'number'
      },
      {
        id: 'success_probability',
        label: 'Success Probability',
        formula: `
          (() => {
            const factors = [
              technical_complexity,
              team_experience,
              project_size,
              stakeholder_alignment,
              resource_availability,
              external_dependencies,
              change_likelihood
            ];
            
            const totalScore = factors.reduce((sum, factor) => sum + factor, 0);
            const maxScore = factors.length * 5;
            const riskScore = (totalScore / maxScore) * 100;
            
            return 100 - riskScore;
          })()
        `,
        format: 'percentage'
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

export default RiskAssessmentTool
