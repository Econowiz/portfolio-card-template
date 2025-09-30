// Enhanced Content Architecture Types
// Flexible content system for interactive data analysis portfolio
import type { Layout } from 'plotly.js'
import type { ReactElement } from 'react'


export type ProjectType = 'standard' | 'interactive' | 'case-study' | 'dashboard'
export type ComponentType = 'chart' | 'dashboard' | 'calculator' | 'simulation' | 'comparison' | 'table'
export type ChartType = 'line' | 'bar' | 'pie' | 'scatter' | 'heatmap' | 'area' | 'plotly' | 'nivo'

// Base interfaces
export interface DataFile {
  id: string
  name: string
  path: string
  type: 'csv' | 'json' | 'xlsx'
  description?: string
  size?: number
}

export interface Attachment {
  id: string
  name: string
  path: string
  type: 'pdf' | 'excel' | 'image' | 'document'
  description?: string
}

// Chart configuration interfaces
export interface BaseChartConfig {
  title: string
  description?: string
  width?: number | string
  height?: number | string
  responsive?: boolean
}

export interface RechartsConfig extends BaseChartConfig {
  library: 'recharts'
  chartType: 'line' | 'bar' | 'pie' | 'area' | 'scatter'
  xAxisKey: string
  yAxisKey: string | string[]
  colors?: string[]
  showGrid?: boolean
  showLegend?: boolean
  showTooltip?: boolean
  xAxisLabel?: string
  yAxisLabel?: string
}

export interface PlotlyConfig extends BaseChartConfig {
  library: 'plotly'
  chartType: 'line' | 'bar' | 'scatter' | 'heatmap' | '3d-scatter' | 'surface'
  traces: PlotlyTrace[]
  layout?: Partial<Layout>
}

export interface PlotlyMarker {
  color?: string | string[]
  size?: number | number[]
  symbol?: string | string[]
  opacity?: number
  line?: {
    color?: string
    width?: number
  }
}

export interface PlotlyTrace {
  x: string | number[]
  y: string | number[]
  z?: string | number[]
  type: string
  mode?: string
  name?: string
  marker?: PlotlyMarker
}

export interface NivoTheme {
  background?: string
  textColor?: string
  fontSize?: number
  axis?: {
    domain?: {
      line?: {
        stroke?: string
        strokeWidth?: number
      }
    }
    ticks?: {
      line?: {
        stroke?: string
        strokeWidth?: number
      }
      text?: {
        fontSize?: number
        fill?: string
      }
    }
  }
  grid?: {
    line?: {
      stroke?: string
      strokeWidth?: number
    }
  }
}

export interface NivoConfig extends BaseChartConfig {
  library: 'nivo'
  chartType: 'line' | 'bar' | 'pie' | 'heatmap'
  dataKey: string
  indexBy?: string
  keys?: string[]
  colors?: string[]
  theme?: NivoTheme
  animate?: boolean
}

export type ChartConfig = RechartsConfig | PlotlyConfig | NivoConfig

// Calculator configuration interfaces
export interface CalculatorField {
  id: string
  label: string
  type: 'number' | 'percentage' | 'currency' | 'select'
  defaultValue?: number | string
  min?: number
  max?: number
  step?: number
  options?: { value: string | number; label: string }[]
  description?: string
  tooltip?: string
}

export interface CalculatorConfig extends BaseChartConfig {
  type: 'roi' | 'risk-assessment' | 'investment' | 'cost-benefit'
  fields: CalculatorField[]
  formula: string // JavaScript expression
  resultFormat: 'currency' | 'percentage' | 'number' | 'decimal' | 'multiplier'
  resultLabel: string
  additionalOutputs?: {
    id: string
    label: string
    formula: string
    format: 'currency' | 'percentage' | 'number' | 'decimal' | 'multiplier'
  }[]
}

// Dashboard configuration interfaces
export interface DashboardWidget {
  id: string
  title: string
  type: 'metric' | 'chart' | 'table' | 'text'
  size: 'small' | 'medium' | 'large' | 'full'
  config: ChartConfig | MetricConfig | TableConfig | TextConfig
  position: { x: number; y: number; w: number; h: number }
}

export interface MetricConfig {
  value: number | string
  label: string
  format: 'currency' | 'percentage' | 'number'
  trend?: {
    value: number
    direction: 'up' | 'down' | 'neutral'
    label: string
  }
  color?: string
}

export interface TableColumn {
  key: string
  label: string
  type: 'text' | 'number' | 'currency' | 'percentage'
  sortable?: boolean
}

export interface TableRow {
  [key: string]: string | number | boolean | null
}

export interface TableConfig {
  columns: TableColumn[]
  data: TableRow[]
  pagination?: boolean
  searchable?: boolean
  exportable?: boolean
}

export interface TextConfig {
  content: string
  format: 'markdown' | 'html' | 'plain'
}

export interface FilterOption {
  value: string | number
  label: string
}

export interface DashboardFilter {
  id: string
  label: string
  type: 'select' | 'date-range' | 'slider'
  options?: FilterOption[]
}

export interface DashboardConfig extends BaseChartConfig {
  widgets: DashboardWidget[]
  layout: 'grid' | 'flex'
  filters?: DashboardFilter[]
}

// Simulation configuration interfaces
export interface SimulationConfig extends BaseChartConfig {
  type: 'monte-carlo' | 'scenario-analysis' | 'sensitivity'
  parameters: CalculatorField[]
  iterations?: number
  outputCharts: ChartConfig[]
  scenarios?: {
    id: string
    name: string
    values: Record<string, number>
  }[]
}

// Comparison configuration interfaces
export interface ComparisonDataset {
  id: string
  name: string
  data: Record<string, string | number | boolean | null>[]
  color?: string
}

export interface ComparisonMetric {
  id: string
  label: string
  formula: string
  format: 'currency' | 'percentage' | 'number'
}

export interface ComparisonConfig extends BaseChartConfig {
  type: 'before-after' | 'side-by-side' | 'overlay'
  datasets: ComparisonDataset[]
  metrics: ComparisonMetric[]
}

// Specific component type interfaces
export interface DashboardComponent extends InteractiveComponent {
  type: 'dashboard'
  config: DashboardConfig
}

export interface ChartComponent extends InteractiveComponent {
  type: 'chart'
  config: ChartConfig
}

export interface CalculatorComponent extends InteractiveComponent {
  type: 'calculator'
  config: CalculatorConfig
}

// Main interactive component interface
export interface InteractiveComponent {
  id: string
  title: string
  description?: string
  type: ComponentType
  config: ChartConfig | CalculatorConfig | DashboardConfig | SimulationConfig | ComparisonConfig | TableConfig
  data?: Record<string, string | number | boolean | null>[]
  dataSource?: string // Reference to DataFile id
  dependencies?: string[] // Other component IDs this depends on
}

// Project content sections - CLEAN ARCHITECTURE
export interface ContentSection {
  id: string
  title: string
  type: 'content'
  content: MarkdownContent
  order: number
}

export interface InteractiveSection {
  id: string
  title: string
  type: 'interactive'
  components: InteractiveComponent[]
  order: number
}

export type ProjectSection = ContentSection | InteractiveSection

export interface MarkdownContent {
  markdown: string
  validated: true
}

// Schema validation interface
export interface ProjectSectionSchema {
  validateSection(section: ProjectSection): boolean
  sanitizeMarkdown(content: string): MarkdownContent
}

// Component registry interface
export interface ComponentRegistry {
  [key: string]: (props: Record<string, unknown>) => ReactElement
}

// Main project content interface
export interface ProjectContent {
  id: string
  title: string
  category: string
  type: ProjectType

  // Basic metadata
  description: string
  tags: string[]
  duration: string
  client?: string

  // Rich media
  hero_image?: string
  gallery?: string[]

  // Content sections
  sections: ProjectSection[]

  // Data & files
  datasets?: DataFile[]
  attachments?: Attachment[]

  // Legacy support for existing projects
  overview?: string
  challenge?: {
    title?: string
    description?: string
    painPoints?: string[]
  }
  solution?: {
    title?: string
    description?: string
    approach?: string[]
    technologies?: string[]
  }
  results?: {
    title?: string
    description?: string
    metrics?: Array<{
      label: string
      value: string | number
      improvement?: string
      description?: string
    }>
    outcomes?: string[]
    businessImpact?: string[]
  }
  lessons?: string[]
}

// Project filter and display options
export interface ProjectFilter {
  category?: string
  type?: ProjectType
  tags?: string[]
  hasInteractive?: boolean
}

export interface ProjectDisplayOptions {
  showInteractive: boolean
  showDatasets: boolean
  showAttachments: boolean
  compactMode: boolean
}
