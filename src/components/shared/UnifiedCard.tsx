import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, type LucideIcon } from 'lucide-react'
import { type ReactNode, type KeyboardEvent } from 'react'
import type { CategoryVisualStyles } from './categoryStyles'

interface UnifiedCardProps {
  title: string
  category: string
  description: string
  image?: string
  icon?: LucideIcon
  tags?: string[]
  date?: string
  index: number
  onCardClick?: () => void
  getCategoryColor: (category: string) => CategoryVisualStyles
  children?: ReactNode
}

const UnifiedCard = ({
  title,
  category,
  description,
  image,
  icon: Icon,
  tags,
  date,
  index,
  onCardClick,
  getCategoryColor,
  children
}: UnifiedCardProps) => {
  const prefersReducedMotion = useReducedMotion()
  const titleId = `card-title-${index}`

  const categoryStyles = getCategoryColor(category)

  const handleHeroKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!onCardClick) return
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onCardClick()
    }
  }
  return (
    <motion.article
      role="listitem"
      aria-labelledby={titleId}
      initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.5, delay: prefersReducedMotion ? 0 : 0.1 * index }}
      className="bg-gradient-jet p-6 rounded-xl border border-jet hover:border-orange-yellow/20 transition-all duration-300 group"
    >
      {/* Card Header - unified hero section */}
      <div
        role={onCardClick ? 'button' : undefined}
        tabIndex={onCardClick ? 0 : undefined}
        aria-label={onCardClick ? `Open ${title}` : undefined}
        onClick={onCardClick}
        onKeyDown={handleHeroKeyDown}
        className={`-m-6 mb-4 h-40 sm:h-48 relative overflow-hidden rounded-t-xl ${
          onCardClick
            ? 'cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-yellow/70'
            : ''
        }`}
      >
        {/* Background Image or Colored Background */}
        {image ? (
          <>
            <img
              src={image}
              alt={`${title} cover`}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/35" aria-hidden="true" />
          </>
        ) : (
          <div className={`absolute inset-0 ${categoryStyles.overlay}`}></div>
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(0,0,0,0.35)_35%,rgba(0,0,0,0.6))]"></div>
        
        {/* Category Badge */}
        <div className="absolute top-3 left-4">
          <span
            className={`px-3 py-1 rounded-full nav-text bg-black/70 backdrop-blur-sm border ${categoryStyles.badgeBorder} ${categoryStyles.badgeText}`}
          >
            <span className={`inline-block h-2.5 w-2.5 rounded-full mr-2 ${categoryStyles.badgeAccent}`} aria-hidden="true" />
            {category}
          </span>
        </div>

        {/* Date (for blog posts) */}
        {date && (
          <div className="absolute top-3 right-4">
            <span className="nav-text text-white-1/80 bg-black/30 px-2 py-1 rounded">
              {date}
            </span>
          </div>
        )}

        {/* Title */}
        <h3 id={titleId} className="card-title absolute bottom-3 left-4 right-4 line-clamp-2 group-hover:text-orange-yellow transition-colors">
          {title}
        </h3>
      </div>

      {/* Card Description */}
      <p className="body-small mb-4 line-clamp-3">
        {description}
      </p>

      {/* Tags (for portfolio projects) */}
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag, tagIndex) => (
            <span
              key={tagIndex}
              className="px-2 py-1 bg-eerie-black-2 text-light-gray nav-text rounded border border-jet"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Custom children content */}
      {children}

      {/* Card Action */}
      <div className="flex items-center justify-between mt-4">
        <button
          onClick={onCardClick}
          aria-label={`${tags ? 'View details for' : 'Read more:'} ${title}`}
          className="nav-text flex items-center gap-2 text-orange-yellow hover:text-white-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-yellow/70 rounded"
          type="button"
        >
          {tags ? 'View Details' : 'Read More'}
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
        
        {Icon && (
          <Icon size={20} className="text-light-gray group-hover:text-orange-yellow transition-colors" />
        )}
      </div>
    </motion.article>
  )
}

export default UnifiedCard
