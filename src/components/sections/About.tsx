import { motion } from 'framer-motion'
import type { CSSProperties } from 'react'
import { useNavigate } from 'react-router-dom'
import { Target, ArrowRight } from 'lucide-react'
import FluidBlobs from '@/components/decor/FluidBlobs'
import HorizontalCarousel from '@/components/decor/HorizontalCarousel'
import InfoBlocks from '@/components/sections/InfoBlocks'


interface AboutProps {
  setActiveTab?: (tab: string) => void
  setSelectedProject?: (projectId: string) => void
}

const About = ({ setActiveTab, setSelectedProject }: AboutProps = {}) => {
  const navigate = useNavigate()

  const featuredProjects = [
    {
      id: 'intelligent-financial-close',
      icon: Target,
      title: 'Intelligent Financial Close System',
      challenge: '12+ day month-end close with fragmented data and heavy manual review',
      solution: 'Implemented ML-assisted anomaly detection, automated workflows, and executive dashboards',
      impact: '73.7% automation rate, $285K annual savings, and a 280% ROI with an 8-hour close',
      businessValue: 'Financial transparency, faster decision cycles, and confident compliance posture',
      category: 'Financial Analytics',
      tags: ['Python', 'Machine Learning', 'Process Automation', 'Analytics']
    }
  ]

  const infoItems = [
    { label: 'Financial Process Automation', value: 'Streamlining month-end closes, reconciliations, and reporting through intelligent automation' },
    { label: 'Predictive Analytics & Forecasting', value: 'Building data-driven models for revenue, cash flow, and strategic scenario planning' },
    { label: 'Business Intelligence & Dashboards', value: 'Creating real-time executive dashboards and self-service analytics platforms' },
    { label: 'Cost Optimization & Analysis', value: 'Identifying efficiency opportunities through data-driven variance and trend analysis' },
  ]


  const handleProjectClick = (projectId: string) => {
    // Navigate to project URL
    navigate(`/project/${projectId}`)
    // Also update local state for immediate UI update (if props are provided)
    if (setSelectedProject && setActiveTab) {
      setSelectedProject(projectId)
      setActiveTab('portfolio')
    }
  }

// NOTE: Optional enhancement — add project.coverUrl to featuredProjects (e.g., '/images/projects/<id>.jpg')
//       Place images under public/images/projects/ and render them behind the gradient overlays below.
//       Keep the gradient fallback via coverFor(category) when no image is provided.

  // helpers for presentation

  const coverFor = (category: string) => {
    switch (category) {
      case 'Process Automation':
        return 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-500/30 via-amber-500/10 to-transparent'
      case 'Financial Analytics':
        return 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-500/30 via-sky-500/10 to-transparent'
      case 'Business Intelligence':
        return 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-500/30 via-green-500/10 to-transparent'
      default:
        return 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-yellow-500/30 via-orange-500/10 to-transparent'
    }
  }

  return (
    <section className="space-y-8" aria-labelledby="about-title">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 id="about-title" className="page-title text-left">About me</h2>


        <div className="h-0.5 w-16 bg-orange-yellow mb-6"></div>

        <div className="space-y-4 text-left">
          <p className="body-normal">
            I translate complex business operations into clear, data-driven action. Whether modernizing finance workflows, building analytics platforms, or partnering with operations teams, I combine controller-level insight with modern data science to unlock measurable results for operators and decision makers.
          </p>
        </div>
      </motion.div>

      {/* Snapshot / Focus Areas */}
      <div className="">
        <InfoBlocks items={infoItems} />
      </div>

      {/* Featured Projects */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >


        <h3 className="section-heading mb-6 tracking-wide">Featured Projects</h3>

        <div className="w-full max-w-7xl mx-auto">
          <HorizontalCarousel>
            {featuredProjects.map((project, index) => (
            <motion.article
              data-carousel-item
              key={project.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.5, delay: 0.05 * index }}
              className="snap-center shrink-0 w-[85%] sm:w-[58%] md:w-[45%] lg:w-[42%] xl:w-[38%] group relative overflow-hidden rounded-2xl border border-jet bg-gradient-jet hover:border-orange-yellow/30 transition-all duration-300 aspect-[4/5] flex flex-col"
              style={{ scrollSnapAlign: 'center' }}
            >
              {/* cover / hero */}
              <div className={`relative h-[60%] w-full ${coverFor(project.category)} overflow-hidden`}>
                {/* flowing blobs backdrop */}
                {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                {/* @ts-ignore - component added separately */}
                <FluidBlobs className="absolute inset-0" />
                <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(0,0,0,0.35)_35%,rgba(0,0,0,0.6))]"></div>
                <div className="absolute top-4 left-4">
                  <span className="nav-text px-3 py-1 bg-orange-yellow/20 text-orange-yellow rounded-full backdrop-blur">
                    {project.category}
                  </span>
                </div>
                <h4 className="card-title absolute bottom-4 left-4 right-4">
                  {project.title}
                </h4>
              </div>

              {/* body */}
              <div className="p-5 sm:p-6 flex flex-col">
                <div className="grid gap-3">
                  <div className="leading-snug">
                    <span className="text-[11px] uppercase tracking-wide text-white-1/80">Challenge</span>
                    <p
                      className="body-small mt-1 text-light-gray/90 leading-snug max-w-[42ch]"
                      style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' } as CSSProperties}
                    >
                      {project.challenge}
                    </p>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-jet flex items-center justify-end gap-4">
                  <button
                    onClick={() => handleProjectClick(project.id)}
                    aria-label={`View case study: ${project.title}`}
                    className="nav-text ml-auto flex items-center gap-2 text-orange-yellow hover:text-white-1 transition-colors group/btn focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-yellow/70 rounded"
                  >
                    View Case Study
                    <ArrowRight size={16} className="transition-transform group-hover/btn:translate-x-1" />
                  </button>
                </div>
              </div>

              {/* glow on hover */}
              <div className="pointer-events-none absolute -inset-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-orange-500/10 via-yellow-500/5 to-transparent blur-xl"></div>
              </div>
            </motion.article>
          ))}
        </HorizontalCarousel>
        </div>

        {/* See more projects CTA */}
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => navigate('/portfolio')}
            className="nav-text inline-flex items-center gap-2 text-orange-yellow hover:text-white-1 transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-yellow/70 rounded"
          >
            See all projects
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </motion.div>


    </section>
  )
}

export default About
