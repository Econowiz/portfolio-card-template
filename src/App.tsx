import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'

import Sidebar from './components/Sidebar'
import MainContent from './components/MainContent'
import ErrorBoundary from './components/ErrorBoundary'
import MarkdownViewPage from './components/pages/MarkdownViewPage'
import ScrollToTopButton from './components/ui/ScrollToTopButton'


/*
✅ URL Routing Implementation Complete
- ✅ Migrated internal tab state to URL routes using react-router-dom
- ✅ Implemented routes: /about, /portfolio, /blog, /contact, /project/:id
- ✅ Added proper navigation with useNavigate()
- ✅ Project deep links working: /project/financial-automation, /project/revenue-forecasting, etc.
- ✅ Browser back/forward buttons work correctly
- ✅ URLs are shareable and bookmarkable
*/

function MetaUpdater() {
  const location = useLocation()
  useEffect(() => {
    const path = location.pathname
    // Let ProjectDetail manage its own title
    if (path.startsWith('/project')) return



    const titleMap: Record<string, string> = {
      '/about': 'About — Franck Rafiou',
      '/portfolio': 'Portfolio — Franck Rafiou',
      '/blog': 'Blog — Franck Rafiou',
      '/contact': 'Contact — Franck Rafiou'
    }

    const descMap: Record<string, string> = {
      '/about': 'About Franck Rafiou — Strategic Finance & Analytics professional blending financial rigor with data-driven insight.',
      '/portfolio': 'Selected projects in financial analytics, automation, and business intelligence by Franck Rafiou.',
      '/blog': 'Articles and notes on finance, analytics, and operations by Franck Rafiou.',
      '/contact': 'Get in touch with Franck Rafiou — available for impactful projects.'
    }

    const defaultTitle = 'Franck Rafiou — Portfolio'
    const defaultDesc = 'Strategic Finance & Analytics professional specializing in financial analysis, automation, and business intelligence.'

    const nextTitle = titleMap[path] ?? defaultTitle
    const nextDesc = descMap[path] ?? defaultDesc

    document.title = nextTitle
    const metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc) metaDesc.setAttribute('content', nextDesc)
  }, [location.pathname])
  return null
}

function App() {
  return (
    <ErrorBoundary>
        {/* Skip link for keyboard users */}
        <a href="#main-content" className="skip-link">Skip to content</a>
        <Router>
          <MetaUpdater />

          <main id="main-content" className="flex flex-col lg:flex-row max-w-7xl mx-auto p-4 lg:p-8 gap-6 overflow-x-hidden">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content with Routes */}
            <Routes>
              <Route path="/" element={<Navigate to="/about" replace />} />
              <Route path="/about" element={<MainContent />} />
              <Route path="/portfolio" element={<MainContent />} />
              <Route path="/blog" element={<MainContent />} />
                  <Route path="/view" element={<MarkdownViewPage />} />

              <Route path="/contact" element={<MainContent />} />
              <Route path="/project/:id" element={<MainContent />} />


            </Routes>
          </main>
        </Router>

              {/* Global scroll-to-top (appears on long scroll) */}
              <ScrollToTopButton />

    </ErrorBoundary>
  )
}

export default App