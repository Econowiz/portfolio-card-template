import React, { useRef, useEffect, useState, Children, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface HorizontalCarouselProps {
  children: React.ReactNode
  className?: string
}

/**
 * HorizontalCarousel
 * - Shows multiple items horizontally with snap scrolling
 * - Next/Prev buttons scroll by approximately one item width
 */
export default function HorizontalCarousel({ children, className }: HorizontalCarouselProps) {
  const scrollerRef = useRef<HTMLDivElement | null>(null)
  const [current, setCurrent] = useState(0)
  const itemsArray = Children.toArray(children)

  const getItemAt = (index: number) => {
    const el = scrollerRef.current
    if (!el) return null
    const node = el.querySelectorAll<HTMLElement>('[data-carousel-item]')[index]
    return node || null
  }

  const snapTo = useCallback((index: number) => {
    const el = scrollerRef.current
    if (!el) return
    const target = getItemAt(index)
    if (!target) return
    
    // Get container padding
    const containerStyle = window.getComputedStyle(el)
    const paddingLeft = parseInt(containerStyle.paddingLeft, 10) || 0
    
    let scrollLeft: number
    
    if (index === 0) {
      // For first item, align to start with some spacing
      scrollLeft = Math.max(0, target.offsetLeft - paddingLeft - 20)
    } else if (index === itemsArray.length - 1) {
      // For last item, align to end
      scrollLeft = target.offsetLeft + target.clientWidth - el.clientWidth + paddingLeft
    } else {
      // For middle items, center them
      const targetCenter = target.offsetLeft + target.clientWidth / 2
      const viewportCenter = (el.clientWidth - paddingLeft) / 2 + paddingLeft
      scrollLeft = targetCenter - viewportCenter
    }
    
    // Clamp to valid scroll range
    const maxScroll = el.scrollWidth - el.clientWidth
    const clampedScroll = Math.max(0, Math.min(scrollLeft, maxScroll))
    
    el.scrollTo({ left: clampedScroll, behavior: 'smooth' })
  }, [itemsArray.length])

  const updateCurrentFromScroll = () => {
    const el = scrollerRef.current
    if (!el) return
    const nodes = Array.from(el.querySelectorAll<HTMLElement>('[data-carousel-item]'))
    if (!nodes.length) return

    const containerWidth = el.clientWidth

    // Find which item we're closest to based on scroll position
    let closestIndex = 0
    let closestDistance = Infinity

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i]
      const nodeLeft = node.offsetLeft - el.scrollLeft
      const nodeCenter = nodeLeft + node.clientWidth / 2
      const viewportCenter = containerWidth / 2

      const distance = Math.abs(nodeCenter - viewportCenter)

      if (distance < closestDistance) {
        closestDistance = distance
        closestIndex = i
      }
    }

    setCurrent(closestIndex)
  }

  // Debug helper: simple debounce
  const debounce = (fn: () => void, wait = 80) => {
    let t: ReturnType<typeof setTimeout> | undefined
    return () => {
      if (t) clearTimeout(t)
      t = setTimeout(fn, wait)
    }
  }


  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return



    const debounced = debounce(() => {
      updateCurrentFromScroll()
    }, 80)

    const onScrollEnd = () => {
      updateCurrentFromScroll()
    }

    const onScroll: EventListener = () => { debounced() }

    el.addEventListener('scroll', onScroll, { passive: true })

    el.addEventListener('scrollend', onScrollEnd)

    // Initial setup - start with first item positioned to show 1st and 2nd cards
    updateCurrentFromScroll()
    
    // Use a timeout to ensure DOM is fully rendered, then position at start
    setTimeout(() => {
      // Instead of centering first item, scroll to show first item optimally
      const firstItem = getItemAt(0)
      if (firstItem && el) {
        // Position so first card is visible with good spacing
        el.scrollTo({ left: 0, behavior: 'smooth' })
        setCurrent(0) // Explicitly set current to 0 for first load
      }
    }, 100)

    return () => {
      el.removeEventListener('scroll', onScroll)
      el.removeEventListener('scrollend', onScrollEnd)
    }
  }, [snapTo])

  const scrollByItem = (dir: 1 | -1) => {
    const next = Math.min(Math.max(current + dir, 0), itemsArray.length - 1)
    snapTo(next)
  }

  return (
    <div className={cn('relative', className)}>
      {/* Navigation Controls - Outside the carousel */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          <button
            type="button"
            aria-label="Previous"
            onClick={() => scrollByItem(-1)}
            disabled={current === 0}
            className="flex items-center justify-center w-8 h-8 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white/5 text-white/80 hover:text-white transition-all duration-200 hover:border-orange-yellow/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-yellow/70"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            aria-label="Next"
            onClick={() => scrollByItem(1)}
            disabled={current === itemsArray.length - 1}
            className="flex items-center justify-center w-8 h-8 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white/5 text-white/80 hover:text-white transition-all duration-200 hover:border-orange-yellow/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-yellow/70"
          >
            <ChevronRight size={16} />
          </button>
        </div>
        
        {/* Dots indicator */}
        <div className="flex items-center gap-2">
          {itemsArray.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === current}
              onClick={() => snapTo(i)}
              className={cn(
                'h-2 w-2 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-yellow/70',
                i === current ? 'bg-orange-yellow' : 'bg-white/25 hover:bg-white/50'
              )}
            />
          ))}
        </div>
      </div>

      {/* Track */}
      <div
        ref={scrollerRef}
        data-scrollbar="none"
        className="flex gap-5 md:gap-6 overflow-x-auto overflow-y-hidden scroll-smooth px-6 sm:px-8 md:px-8 py-3 md:py-4"
        style={{ 
          scrollBehavior: 'smooth', 
          msOverflowStyle: 'none', 
          scrollbarWidth: 'none',
          scrollSnapType: 'x mandatory'
        }}
      >
        {children}
      </div>

      <style>{`[data-scrollbar="none"]::-webkit-scrollbar{ display: none; }`}</style>
    </div>
  )
}

