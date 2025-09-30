import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useSearchParams } from 'react-router-dom'
// import { Calculator, BarChart, TrendingUp, Settings } from 'lucide-react'
import ProjectDetail from './ProjectDetail'
import { UnifiedCard, UnifiedGrid } from '../shared'
import { getPortfolioCategoryStyles } from '../shared/categoryStyles'

interface ProjectSummary {
  id: string
  title: string
  category: string
  type: string
  description: string
  tags: string[]
  duration: string
  client?: string
  hero_image?: string
  hasInteractive: boolean
  featured: boolean
  order: number
}

interface ProjectsIndex {
  projects: ProjectSummary[]
  categories: Array<{
    id: string
    name: string
    description: string
    color: string
    icon: string
  }>
  tags: string[]
}

interface PortfolioProps {
  selectedProject?: string | null
  setSelectedProject?: (projectId: string | null) => void
}
// NOTE: Future enhancement — support deep links by reading the project id (e.g., via useParams)
//       and syncing filters from query params such as ?category=Financial%20Analytics.
//
// NOTE: Optional cover images can be added via project.coverUrl (e.g., '/images/projects/slug/hero.jpg')
//       and rendered behind the hero gradient while keeping the gradient fallback in place.


// Fallback projects (module-level constant for stable reference)
const fallbackProjects: ProjectSummary[] = [
  {
    id: 'intelligent-financial-close',
    title: 'Intelligent Financial Close System',
    category: 'Financial Analytics',
    type: 'interactive',
    description: 'Enterprise ML-powered financial close automation achieving 73.7% automation rate, $285K annual savings, and 280% ROI through advanced anomaly detection and predictive analytics.',
    tags: ['Python', 'Machine Learning', 'Financial Analytics', 'Process Automation', 'ML', 'Statistical Analysis'],
    duration: '6 months',
    client: 'Industry: Enterprise Finance',
    hasInteractive: true,
    featured: true,
    order: 0
  }
]

const Portfolio = ({ selectedProject, setSelectedProject }: PortfolioProps) => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const categoryParam = searchParams.get('category') || null

  const [activeFilter, setActiveFilter] = useState(categoryParam ?? 'All')
  const [projects, setProjects] = useState<ProjectSummary[]>([])
  const [categories, setCategories] = useState<string[]>(['All'])
  const [loading, setLoading] = useState(true)
  const [error] = useState<string | null>(null)

  // Load projects from data file
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const response = await fetch('/data/projects/index.json')
        if (response.ok) {
          const projectsIndex: ProjectsIndex = await response.json()
          setProjects(projectsIndex.projects.sort((a, b) => a.order - b.order))

          // Extract unique categories
          const uniqueCategories = ['All', ...Array.from(new Set(projectsIndex.projects.map(p => p.category)))]
          setCategories(uniqueCategories)
        } else {
          // Fallback to hardcoded projects if no data exists yet
          setProjects(fallbackProjects)
        }
      } catch {
        // Fallback to hardcoded projects
        setProjects(fallbackProjects)
      } finally {
        setLoading(false)
      }
    }

    loadProjects()
  }, [])

  // Sync active filter with URL query (category)
  useEffect(() => {
    if (loading) return

    if (categoryParam && categories.includes(categoryParam)) {
      setActiveFilter(categoryParam)
      return
    }

    if (categoryParam && !categories.includes(categoryParam)) {
      setActiveFilter('All')
      const next = new URLSearchParams(searchParams)
      next.delete('category')
      setSearchParams(next, { replace: true })
      return
    }

    if (!categoryParam) {
      setActiveFilter('All')
    }
  }, [loading, categories, categoryParam, searchParams, setSearchParams])

  const buildSearchString = (filter: string): string => {
    if (filter === 'All') return ''
    const params = new URLSearchParams()
    params.set('category', filter)
    return `?${params.toString()}`
  }

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter)

    const next = new URLSearchParams(searchParams)
    if (filter === 'All') {
      next.delete('category')
    } else {
      next.set('category', filter)
    }
    setSearchParams(next, { replace: true })
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="text-center py-12">
          <p className="body-normal">Loading projects...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="text-center py-12">
          <p className="text-red-400">Error loading projects: {error}</p>
        </div>
      </div>
    )
  }

  const filteredProjects = activeFilter === 'All'
    ? projects
    : projects.filter(project => project.category === activeFilter)

  const handleProjectClick = (projectId: string) => {
    const searchSuffix = buildSearchString(activeFilter)
    navigate(`/project/${projectId}${searchSuffix}`)
    if (setSelectedProject) {
      setSelectedProject(projectId)
    }
  }

  const handleBackToPortfolio = () => {
    const searchSuffix = buildSearchString(activeFilter)
    navigate(searchSuffix ? `/portfolio${searchSuffix}` : '/portfolio')
    if (setSelectedProject) {
      setSelectedProject(null)
    }
  }

  // If a project is selected, show the detailed view
  if (selectedProject) {
    return <ProjectDetail projectId={selectedProject} onBack={handleBackToPortfolio} />
  }

  return (
    <section className="space-y-8" aria-labelledby="portfolio-title">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 id="portfolio-title" className="page-title text-left">Portfolio</h2>

        <div className="h-0.5 w-16 bg-orange-yellow mb-6"></div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        role="group"
        aria-label="Project categories"
        className="flex flex-wrap gap-2"
      >
        {categories.map((filter) => (
          <button
            key={filter}
            onClick={() => handleFilterChange(filter)}
            aria-pressed={activeFilter === filter}
            className={`nav-text px-4 py-2 rounded-lg transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-yellow/70 ${
              activeFilter === filter
                ? 'bg-orange-yellow text-smoky-black'
                : 'bg-gradient-jet text-light-gray hover:text-orange-yellow border border-jet'
            }`}
          >
            {filter}
          </button>
        ))}
      </motion.div>

      {/* Projects Grid */}
      <UnifiedGrid>
        {filteredProjects.map((project, index) => (
          <UnifiedCard
            key={project.id}
            title={project.title}
            category={project.category}
            description={project.description}
            tags={project.tags}
            image={project.hero_image}
            index={index}
            getCategoryColor={getPortfolioCategoryStyles}
            onCardClick={() => handleProjectClick(project.id)}
          />
        ))}
      </UnifiedGrid>

      {/* No projects message */}
      {filteredProjects.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center py-12"
        >
          <p className="body-normal">No projects found for the selected category.</p>
        </motion.div>
      )}
    </section>
  )
}

export default Portfolio
