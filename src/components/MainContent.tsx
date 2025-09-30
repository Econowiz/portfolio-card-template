import { useState, useEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { useLocation, useParams } from 'react-router-dom'
import Navigation from './Navigation'
import About from './sections/About'
import Portfolio from './sections/Portfolio'
import Blog from './sections/Blog'
import Contact from './sections/Contact'


// ✅ Routing Integration Complete
// - ✅ activeTab synced with current pathname using useLocation
// - ✅ /project/:id routes properly handled with selectedProject state
// - ✅ Navigation uses useNavigate for proper URL routing


const MainContent = () => {
  const [activeTab, setActiveTab] = useState('about')
  const [selectedProject, setSelectedProject] = useState<string | null>(null)
  const location = useLocation()
  const params = useParams()

  const prefersReducedMotion = useReducedMotion()

  // Sync activeTab and selectedProject with URL pathname
  useEffect(() => {
    const pathname = location.pathname

    // Project detail route takes precedence
    if (pathname.startsWith('/project/')) {
      setActiveTab('portfolio')
      setSelectedProject(params.id ?? null)
      return
    }

    // For any non-project route, ensure no project is selected
    if (selectedProject !== null) {
      setSelectedProject(null)
    }

    if (pathname === '/' || pathname === '/about') {
      setActiveTab('about')
    } else if (pathname === '/portfolio') {
      setActiveTab('portfolio')
    } else if (pathname === '/blog') {
      setActiveTab('blog')
    } else if (pathname === '/contact') {
      setActiveTab('contact')
    } else {
      setActiveTab('about')
    }
  }, [location.pathname, params.id, selectedProject])

  const renderContent = () => {
    switch (activeTab) {
      case 'about':
        return <About />
      case 'portfolio':
        return <Portfolio selectedProject={selectedProject} setSelectedProject={setSelectedProject} />
      case 'blog':
        return <Blog />
      case 'contact':
        return <Contact />
      default:
        return <About />
    }
  }

  return (
    <motion.div
      initial={prefersReducedMotion ? undefined : { x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.5, delay: prefersReducedMotion ? 0 : 0.2 }}
      className="flex-1 max-w-4xl w-full"
    >
      <div className="relative rounded-2xl overflow-hidden border border-white/5 bg-eerie-black-1 backdrop-blur-sm shadow-2xl shadow-black/50 ring-1 ring-white/10">
        {/* Navigation */}
        <Navigation />

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
          className="p-6 lg:p-8"
        >
          {renderContent()}
        </motion.div>
      </div>
    </motion.div>
  )
}

export default MainContent
