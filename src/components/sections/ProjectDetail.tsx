import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, Tag, Target, Lightbulb, TrendingUp, CheckCircle, Download, ExternalLink } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import type { ProjectContent, ProjectType } from '../../types'
import { ComponentRenderer } from '../interactive'
import { MarkdownRenderer } from '../common'

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const extractLegacyMarkdown = (section: unknown): string | null => {
  if (!isRecord(section)) return null
  const content = section['content']
  return typeof content === 'string' ? content : null
}

interface ProjectDetailProps {
  projectId: string
  onBack: () => void
}

const ProjectDetail = ({ projectId, onBack }: ProjectDetailProps) => {
  const [projectData, setProjectData] = useState<ProjectContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Ensure the browser doesn't fight our manual restore on back/forward
  useEffect(() => {
    const history = window.history
    const previous = history.scrollRestoration

    if (!previous) {
      return undefined
    }

    history.scrollRestoration = 'manual'

    return () => {
      history.scrollRestoration = previous
    }
  }, [])

  // Handle BFCache restores (Brave/Safari/etc.)
  useEffect(() => {
    const isPageTransitionEvent = (event: Event): event is PageTransitionEvent =>
      'persisted' in event

    const handler = (event: Event) => {
      if (!isPageTransitionEvent(event) || !event.persisted) {
        return
      }
      // Try to restore from saved anchor/Y when page is restored from bfcache
      const yKey = `scroll:project:${projectId}`
      const savedY = sessionStorage.getItem(yKey)
      const savedAnchor = sessionStorage.getItem(`${yKey}:anchor`)
      if (!savedY && !savedAnchor) return
      const tryRestore = () => {
        if (savedAnchor) {
          const el = document.getElementById(savedAnchor)
          if (el) { el.scrollIntoView({ block: 'start', behavior: 'auto' }); return true }
        }
        if (savedY) {
          const y = parseInt(savedY, 10)
          if (!Number.isNaN(y)) { window.scrollTo({ top: y, left: 0, behavior: 'auto' }); return true }
        }
        return false
      }
      ;[0, 100, 300].forEach((delay) => {
        setTimeout(() => {
          tryRestore()
        }, delay)
      })
    }
    window.addEventListener('pageshow', handler)
    return () => window.removeEventListener('pageshow', handler)
  }, [projectId])

  // Load enhanced project data
  useEffect(() => {
    const loadProjectData = async () => {
      setLoading(true)
      setError(null)

      try {
        // Try to load enhanced project data first
        const response = await fetch(`/data/projects/${projectId}/metadata.json`)
        if (response.ok) {
          const data = await response.json()
          setProjectData(data)
        } else {
          // Fallback to legacy project data
          const legacyData = getLegacyProjectData(projectId)
          if (legacyData) {
            setProjectData(legacyData)
          } else {
            setError('Project not found')
          }
        }
      } catch {
        // Fallback to legacy project data
        const legacyData = getLegacyProjectData(projectId)
        if (legacyData) {
          setProjectData(legacyData)
        } else {
          setError('Failed to load project data')
        }
      } finally {
        setLoading(false)
      }
    }

    loadProjectData()
  }, [projectId])

  // Simple SEO: Update document title when project loads
  useEffect(() => {
    if (projectData) {
      document.title = `${projectData.title} - Franck Rafiou Portfolio`
    }
    return () => {
      document.title = 'Franck Rafiou - Portfolio'
    }
  }, [projectData])

  // Restore scroll position when returning from viewer (robust against layout shifts)
  useEffect(() => {
    if (loading) return

    const yKey = `scroll:project:${projectId}`
    const anchorKey = `${yKey}:anchor`
    const savedY = sessionStorage.getItem(yKey)
    const savedAnchor = sessionStorage.getItem(anchorKey)

    if (!savedY && !savedAnchor) return

    const tryRestore = () => {
      // Prefer anchor when available (e.g., downloads-section)
      if (savedAnchor) {
        const el = document.getElementById(savedAnchor)
        if (el) {
          el.scrollIntoView({ block: 'start', behavior: 'auto' })
          return true
        }
      }
      // Fallback to stored Y
      if (savedY) {
        const y = parseInt(savedY, 10)
        if (!Number.isNaN(y)) {
          window.scrollTo({ top: y, left: 0, behavior: 'auto' })
          return true
        }
      }
      return false
    }

    // Attempt multiple times to accommodate images/charts loading
    const delays = [0, 100, 300, 600]
    let restored = false
    delays.forEach((d) => {
      setTimeout(() => {
        if (!restored) restored = tryRestore()
      }, d)
    })

    // Cleanup and clear stored keys after a second
    const clear = setTimeout(() => {
      sessionStorage.removeItem(yKey)
      sessionStorage.removeItem(anchorKey)
    }, 1200)

    return () => clearTimeout(clear)
  }, [loading, projectId])

  const getLegacyProjectData = (id: string): ProjectContent | null => {
    switch (id) {
      case 'financial-automation':
        return {
          id: 'financial-automation',
          title: 'Financial Process Automation',
          category: 'Process Automation',
          type: 'standard',
          description: 'Transformed manual financial reconciliation processes through intelligent automation, eliminating errors and reducing processing time by 85%.',
          tags: ['Python', 'Automation', 'VBA', 'Process Improvement'],
          duration: '3 months',
          client: 'Manufacturing Company',
          overview: 'Transformed manual financial reconciliation processes through intelligent automation, eliminating errors and reducing processing time by 85%.',
          sections: [],
          challenge: {
            title: 'The Challenge',
            description: 'The finance team was spending 40+ hours monthly on manual reconciliation processes, leading to frequent errors, delayed reporting, and team burnout. The manual process involved cross-referencing multiple data sources, identifying discrepancies, and creating adjustment entries.',
            painPoints: [
              'Manual data entry errors causing financial discrepancies',
              '40+ hours monthly spent on repetitive tasks',
              'Delayed month-end closing by 3-5 days',
              'High stress levels during reconciliation periods',
              'Lack of audit trail for reconciliation decisions'
            ]
          },
          solution: {
            title: 'The Solution',
            description: 'Developed a comprehensive Python-based automation system with built-in data validation, error detection, and automated reporting capabilities.',
            approach: [
              'Analyzed existing reconciliation workflows and identified automation opportunities',
              'Built Python scripts with pandas for data processing and validation',
              'Implemented automated data matching algorithms with configurable tolerance levels',
              'Created exception handling for complex reconciliation scenarios',
              'Developed automated reporting with detailed audit trails',
              'Integrated with existing ERP system for seamless data flow'
            ],
            technologies: ['Python', 'Pandas', 'Excel VBA', 'SQL', 'ERP Integration']
          },
          results: {
            title: 'Results & Impact',
            description: 'The automation solution delivered immediate and sustained improvements across multiple dimensions.',
            metrics: [
              { label: 'Processing Time Reduction', value: '85%', description: 'From 40+ hours to 6 hours monthly' },
              { label: 'Error Elimination', value: '100%', description: 'Zero manual data entry errors' },
              { label: 'Annual Cost Savings', value: '$20K+', description: 'Through reduced labor and improved efficiency' },
              { label: 'Month-end Acceleration', value: '3-5 days', description: 'Faster financial close process' }
            ],
            businessImpact: [
              'Finance team redirected to strategic analysis and planning',
              'Improved accuracy in financial reporting and compliance',
              'Enhanced audit trail and regulatory compliance',
              'Reduced stress and improved team morale',
              'Scalable solution adaptable to business growth'
            ]
          },
          lessons: [
            'Stakeholder involvement crucial for identifying edge cases',
            'Phased implementation reduces risk and builds confidence',
            'Comprehensive testing prevents production issues',
            'Documentation and training ensure long-term success'
          ]
        }

      case 'revenue-forecasting':
        return {
          id: 'revenue-forecasting',
          title: 'Revenue Forecasting Model',
          category: 'Financial Analytics',
          type: 'standard' as ProjectType,
          description: 'Built a machine learning-powered revenue forecasting model achieving 92% accuracy, enabling data-driven strategic planning and resource allocation.',
          tags: ['Python', 'Machine Learning', 'Forecasting', 'Analytics'],
          duration: '4 months',
          client: 'Technology Services Company',
          sections: [],
          overview: 'Built a machine learning-powered revenue forecasting model achieving 92% accuracy, enabling data-driven strategic planning and resource allocation.',
          challenge: {
            title: 'The Challenge',
            description: 'The company struggled with inaccurate revenue predictions, making it difficult to plan resources, set realistic targets, and make informed strategic decisions.',
            painPoints: [
              'Revenue forecasts consistently off by 15-20%',
              'Inability to predict seasonal variations accurately',
              'Resource planning challenges due to forecast uncertainty',
              'Missed opportunities due to conservative projections',
              'Lack of confidence in financial planning processes'
            ]
          },
          solution: {
            title: 'The Solution',
            description: 'Developed a sophisticated predictive analytics model combining historical data, market indicators, and machine learning algorithms.',
            approach: [
              'Collected and cleaned 3+ years of historical revenue data',
              'Identified key external factors affecting revenue (market trends, seasonality)',
              'Built multiple forecasting models (ARIMA, Random Forest, Neural Networks)',
              'Implemented ensemble methods for improved accuracy',
              'Created interactive dashboards for scenario planning',
              'Established automated model retraining processes'
            ],
            technologies: ['Python', 'Scikit-learn', 'TensorFlow', 'Pandas', 'Power BI', 'SQL']
          },
          results: {
            title: 'Results & Impact',
            description: 'The forecasting model transformed the company\'s planning capabilities and strategic decision-making process.',
            metrics: [
              { label: 'Forecast Accuracy', value: '92%', description: 'Improved from 80-85% baseline' },
              { label: 'Planning Confidence', value: '40%', description: 'Increase in strategic planning confidence' },
              { label: 'Resource Optimization', value: '25%', description: 'Better resource allocation efficiency' },
              { label: 'Decision Speed', value: '50%', description: 'Faster strategic decision making' }
            ],
            businessImpact: [
              'More accurate budget planning and resource allocation',
              'Improved investor confidence through reliable projections',
              'Better timing for market expansion and investments',
              'Enhanced ability to identify growth opportunities',
              'Reduced financial risk through better planning'
            ]
          },
          lessons: [
            'Data quality is fundamental to model accuracy',
            'Regular model validation prevents drift',
            'User-friendly interfaces drive adoption',
            'Continuous monitoring ensures sustained performance'
          ]
        }

      case 'cost-optimization':
        return {
          id: 'cost-optimization',
          title: 'Cost Optimization Analysis',
          category: 'Business Intelligence',
          type: 'standard' as ProjectType,
          description: 'Conducted comprehensive cost analysis using advanced analytics, identifying and implementing a 15% cost reduction across multiple departments.',
          tags: ['SQL', 'Tableau', 'Cost Analysis', 'Data Visualization'],
          duration: '2 months',
          client: 'Multi-department Organization',
          sections: [],
          overview: 'Conducted comprehensive cost analysis using advanced analytics, identifying and implementing a 15% cost reduction across multiple departments.',
          challenge: {
            title: 'The Challenge',
            description: 'Rising operational costs without clear visibility into cost drivers, making it difficult to identify optimization opportunities and implement targeted cost reduction strategies.',
            painPoints: [
              'Operational costs increasing by 8% annually',
              'Limited visibility into departmental cost drivers',
              'Difficulty identifying inefficiencies across departments',
              'Lack of data-driven cost reduction strategies',
              'Resistance to cost-cutting without clear justification'
            ]
          },
          solution: {
            title: 'The Solution',
            description: 'Implemented a comprehensive cost analysis framework using advanced analytics and data visualization to identify optimization opportunities.',
            approach: [
              'Collected cost data from multiple departments and systems',
              'Built comprehensive cost analysis dashboards in Tableau',
              'Performed statistical analysis to identify cost anomalies',
              'Conducted benchmarking analysis against industry standards',
              'Developed cost optimization recommendations with ROI projections',
              'Created implementation roadmap with priority rankings'
            ],
            technologies: ['SQL', 'Tableau', 'Python', 'Excel', 'Statistical Analysis']
          },
          results: {
            title: 'Results & Impact',
            description: 'The cost optimization initiative delivered significant savings while maintaining operational effectiveness.',
            metrics: [
              { label: 'Cost Reduction', value: '15%', description: 'Across multiple departments' },
              { label: 'Annual Savings', value: '$150K+', description: 'Recurring annual cost savings' },
              { label: 'Process Efficiency', value: '30%', description: 'Improvement in key processes' },
              { label: 'Implementation Speed', value: '6 weeks', description: 'From analysis to implementation' }
            ],
            businessImpact: [
              'Improved profit margins and financial performance',
              'Enhanced operational efficiency across departments',
              'Better cost visibility and control mechanisms',
              'Data-driven culture for continuous improvement',
              'Freed up resources for strategic investments'
            ]
          },
          lessons: [
            'Cross-departmental collaboration essential for success',
            'Data visualization drives stakeholder buy-in',
            'Quick wins build momentum for larger changes',
            'Continuous monitoring ensures sustained savings'
          ]
        }

      default:
        return null
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="h-8 bg-jet rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-jet rounded w-2/3 mb-6"></div>
          <div className="space-y-4">
            <div className="h-32 bg-jet rounded"></div>
            <div className="h-32 bg-jet rounded"></div>
            <div className="h-32 bg-jet rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !projectData) {
    return (
      <div className="text-center py-12">
        <p className="body-normal">{error || 'Project not found.'}</p>
        <button
          onClick={onBack}
          aria-label="Back to portfolio"
          className="mt-4 text-orange-yellow hover:text-white-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-yellow/70 rounded"
        >
          ← Back to Portfolio
        </button>
      </div>
    )
  }

  return (
    <section className="space-y-8" aria-labelledby="project-title">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <button
          onClick={onBack}
          aria-label="Back to portfolio"
          className="flex items-center gap-2 text-orange-yellow hover:text-white-1 transition-colors mb-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-yellow/70 rounded"
        >
          <ArrowLeft size={20} />
          Back to Portfolio
        </button>

        <h1 id="project-title" className="project-title">{projectData.title}</h1>

        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center gap-2 text-light-gray">
            <Tag size={16} />
            <span>{projectData.category}</span>
          </div>
          <div className="flex items-center gap-2 text-light-gray">
            <Calendar size={16} />
            <span>{projectData.duration}</span>
          </div>
          {projectData.client && (
            <div className="flex items-center gap-2 text-light-gray">
              <ExternalLink size={16} />
              <span>{projectData.client}</span>
            </div>
          )}
        </div>

        {/* Tags */}
        {projectData.tags && projectData.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {projectData.tags.map((tag, index) => (
              <span
                key={index}
                className="body-small px-3 py-1 bg-eerie-black-2 rounded border border-jet"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <p className="body-normal">
          {projectData.description || projectData.overview}
        </p>
      </motion.div>

      {/* Enhanced Sections or Legacy Content */}
      {projectData.sections && projectData.sections.length > 0 ? (
        // Render enhanced sections
        projectData.sections
          .sort((a, b) => a.order - b.order)
          .map((section, index) => {
            const legacyMarkdown = extractLegacyMarkdown(section)

            return (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
                className="space-y-6"
              >
                {/* Section Header */}
                <div className="border-l-4 border-orange-yellow pl-4">
                  <h2 className="project-section">{section.title}</h2>
                </div>

                {/* Section Content */}
                {section.type === 'content' && (
                  <MarkdownRenderer content={section.content.markdown} />
                )}
                {/* Back-compat: support legacy sections with type: "text" and raw markdown string */}
                {legacyMarkdown && (
                  <MarkdownRenderer content={legacyMarkdown} />
                )}

                {/* Interactive Components */}
                {section.type === 'interactive' && section.components && section.components.length > 0 && (
                  <div className="space-y-6">
                    {section.components.map((component) => (
                      <ComponentRenderer
                        key={component.id}
                        component={component}
                        className="w-full"
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            )
          })
      ) : (
        // Render legacy content
        <>
          {/* Challenge Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-gradient-jet p-6 rounded-xl border border-jet"
      >
        <div className="flex items-center gap-3 mb-4">
          <Target className="text-red-400" size={24} />
          <h2 className="project-section">{projectData.challenge?.title || 'Challenge'}</h2>
        </div>

        <p className="body-normal mb-4">{projectData.challenge?.description}</p>

        {projectData.challenge?.painPoints && (
          <div className="space-y-2">
            <h3 className="project-subsection">Key Pain Points:</h3>
            <ul className="space-y-2">
              {projectData.challenge.painPoints.map((point, index) => (
                <li key={index} className="body-small flex items-start gap-2">
                  <span className="text-red-400 mt-1">•</span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        )}
      </motion.div>

      {/* Solution Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-gradient-jet p-6 rounded-xl border border-jet"
      >
        <div className="flex items-center gap-3 mb-4">
          <Lightbulb className="text-blue-400" size={24} />
          <h2 className="project-section">{projectData.solution?.title || 'Solution'}</h2>
        </div>

        <p className="body-normal mb-4">{projectData.solution?.description}</p>

        <div className="space-y-4">
          {projectData.solution?.approach && (
            <div>
              <h3 className="project-subsection mb-2">Approach:</h3>
              <ul className="space-y-2">
                {projectData.solution.approach.map((step, index) => (
                  <li key={index} className="body-small flex items-start gap-2">
                    <span className="text-blue-400 mt-1">{index + 1}.</span>
                    {step}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {projectData.solution?.technologies && (
            <div>
              <h3 className="project-subsection mb-2">Technologies Used:</h3>
              <div className="flex flex-wrap gap-2">
                {projectData.solution.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="body-small px-3 py-1 bg-eerie-black-2 rounded border border-jet"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Results Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-gradient-jet p-6 rounded-xl border border-jet"
      >
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="text-green-400" size={24} />
          <h2 className="project-section">{projectData.results?.title || 'Results & Impact'}</h2>
        </div>

        <p className="body-normal mb-6">{projectData.results?.description}</p>

        {projectData.results?.metrics && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {projectData.results.metrics.map((metric, index) => (
              <div key={index} className="bg-eerie-black-2 p-4 rounded-lg border border-jet">
                <div className="display-number text-orange-yellow">{metric.value}</div>
                <div className="body-normal text-white-1 mb-1">{metric.label}</div>
                <div className="body-small text-light-gray">{metric.description}</div>
              </div>
            ))}
          </div>
        )}

        {projectData.results?.businessImpact && (
          <div>
            <h3 className="project-subsection mb-2">Business Impact:</h3>
            <ul className="space-y-2">
              {projectData.results.businessImpact.map((impact, index) => (
                <li key={index} className="body-small flex items-start gap-2">
                  <CheckCircle className="text-green-400 mt-0.5 flex-shrink-0" size={16} />
                  {impact}
                </li>
              ))}
            </ul>
          </div>
        )}
      </motion.div>

      {/* Lessons Learned */}
      {projectData.lessons && projectData.lessons.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-gradient-jet p-6 rounded-xl border border-jet"
        >
          <h2 className="project-section mb-content-md">Key Lessons Learned</h2>
          <ul className="space-y-2">
            {projectData.lessons.map((lesson, index) => (
              <li key={index} className="body-small flex items-start gap-2">
                <span className="text-orange-yellow mt-1">💡</span>
                {lesson}
              </li>
            ))}
          </ul>
        </motion.div>
      )}
        </>
      )}

      {/* Attachments & Downloads */}
      {projectData.attachments && projectData.attachments.length > 0 && (
        <motion.div
          id="downloads-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          
          className="bg-gradient-jet p-6 rounded-xl border border-jet"
        >
          <div className="flex items-center gap-3 mb-4">
            <Download className="text-orange-yellow" size={24} />
            <h2 className="project-section">Downloads & Resources</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projectData.attachments.map((attachment) => {
              const isMd = attachment.path.endsWith('.md')
              const viewTo = isMd ? `/view?path=${encodeURIComponent(attachment.path)}` : undefined
              return (
                <div key={attachment.id} className="space-y-2">
                  {isMd ? (
                    <Link
                      to={viewTo!}
                      onClick={() => {
                        try {
                          const yKey = `scroll:project:${projectId}`
                          sessionStorage.setItem(yKey, String(window.scrollY))
                          sessionStorage.setItem(`${yKey}:anchor`, 'downloads-section')
                        } catch (storageError) {
                          console.warn('Failed to persist project scroll position', storageError)
                        }
                      }}
                      className="flex items-center gap-3 p-4 bg-eerie-black-2 rounded-lg border border-jet hover:border-orange-yellow transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-yellow/70"
                    >
                      <div className="flex-shrink-0">
                        {attachment.type === 'document' ? <span className="text-orange-yellow">📝</span> : <span className="text-blue-400">🗎</span>}
                      </div>
                      <div className="flex-1">
                        <div className="body-normal text-white-1 group-hover:text-orange-yellow transition-colors">
                          {attachment.name}
                        </div>
                        {attachment.description && (
                          <div className="body-small text-light-gray">{attachment.description}</div>
                        )}
                      </div>
                      <ExternalLink className="text-light-gray group-hover:text-orange-yellow transition-colors" size={16} />
                    </Link>
                  ) : (
                    <a
                      href={attachment.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 bg-eerie-black-2 rounded-lg border border-jet hover:border-orange-yellow transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-yellow/70"
                    >
                      <div className="flex-shrink-0">
                        {attachment.type === 'pdf' && <span className="text-red-400">📄</span>}
                        {attachment.type === 'excel' && <span className="text-green-400">📊</span>}
                        {attachment.type === 'image' && <span className="text-blue-400">🖼️</span>}
                        {attachment.type === 'document' && <span className="text-orange-yellow">📝</span>}
                      </div>
                      <div className="flex-1">
                        <div className="body-normal text-white-1 group-hover:text-orange-yellow transition-colors">
                          {attachment.name}
                        </div>
                        {attachment.description && (
                          <div className="body-small text-light-gray">{attachment.description}</div>
                        )}
                      </div>
                      <ExternalLink className="text-light-gray group-hover:text-orange-yellow transition-colors" size={16} />
                    </a>
                  )}

                </div>
              )
            })}
          </div>
        </motion.div>
      )}
    </section>
  )
}

export default ProjectDetail
