import { motion } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'

const Navigation = () => {
  const location = useLocation()

  const navItems = [
    { id: 'about', label: 'About' },
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'blog', label: 'Blog' },
    { id: 'contact', label: 'Contact' }
  ]

  const isActiveForItem = (id: string) => {
    if (id === 'portfolio') {
      return (
        location.pathname.startsWith('/project/') ||
        location.pathname.startsWith('/portfolio')
      )
    }
    if (id === 'about') {
      return location.pathname === '/' || location.pathname === '/about'
    }
    return location.pathname.startsWith(`/${id}`)
  }

  const handleSmoothScrollTop = () => {
    try {
      const el = document.getElementById('main-content')
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      } else {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
      }
    } catch {
      /* no-op */
    }
  }

  return (
    <nav aria-label="Primary" className="border-b border-jet bg-eerie-black-1 rounded-t-2xl">
      <div className="flex justify-center overflow-x-auto px-2 sm:px-0">
        {navItems.map((item) => {
          const active = isActiveForItem(item.id)
          return (
            <Link
              key={item.id}
              to={`/${item.id}`}
              onClick={handleSmoothScrollTop}
              aria-current={active ? 'page' : undefined}
              className={`nav-text relative px-4 sm:px-6 md:px-8 py-4 whitespace-nowrap transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-yellow/70 focus-visible:rounded-md ${
                active ? 'text-white-1' : 'text-light-gray hover:text-light-gray-70'
              }`}
            >
              {item.label}
              {active && (
                <motion.div
                  layoutId="nav-underline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-yellow"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

export default Navigation
