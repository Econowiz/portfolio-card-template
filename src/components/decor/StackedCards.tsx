import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { cn } from '@/lib/utils'

export interface StackedItem {
  title: string
  category?: string
  gradientClass?: string
}

interface StackedCardsProps {
  items: StackedItem[]
  className?: string
}

/**
 * StackedCards: sticky stacked cards with gentle motion on scroll.
 * - The section is tall; each card is sticky so they appear to stack.
 * - We add slight parallax/scale per card from scroll progress.
 */
export default function StackedCards({ items, className }: StackedCardsProps) {
  const ref = useRef<HTMLDivElement | null>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start center', 'end center'] })

  // Pre-calculate transforms for each item (fixed 3 items) to avoid calling hooks in map
  const y0 = useTransform(scrollYProgress, [0, 1], [0, -140])
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200])
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -260])

  const scale0 = useTransform(scrollYProgress, [0, 1], [1, 0.92])
  const scale1 = useTransform(scrollYProgress, [0, 1], [0.97, 0.89])
  const scale2 = useTransform(scrollYProgress, [0, 1], [0.94, 0.86])

  const itemTransforms = [
    { y: y0, scale: scale0, shadowOpacity: 0.6 },
    { y: y1, scale: scale1, shadowOpacity: 0.48 },
    { y: y2, scale: scale2, shadowOpacity: 0.36 }
  ]

  return (
    <section ref={ref} className={cn('relative h-[320vh] md:h-[360vh]', className)}>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/20" />
      <div className="relative mx-auto max-w-3xl">
        {items.slice(0, 3).map((item, i) => {
          const transforms = itemTransforms[i]

          return (
            <motion.article
              key={item.title + i}
              style={{
                y: transforms.y,
                scale: transforms.scale,
                zIndex: i + 1,
                willChange: 'transform'
              }}
              className={cn(
                'sticky top-[12vh] md:top-[16vh] rounded-2xl border border-white/5 ring-1 ring-white/10 shadow-2xl overflow-hidden',
                'backdrop-blur-sm bg-eerie-black-1'
              )}
            >
              <div className={cn('relative h-48 sm:h-60', item.gradientClass)}>
                <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(0,0,0,0.35)_35%,rgba(0,0,0,0.65))]" />
                {item.category && (
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-orange-yellow/20 text-orange-yellow text-xs font-medium rounded-full backdrop-blur">
                      {item.category}
                    </span>
                  </div>
                )}
                <h4 className="absolute bottom-4 left-4 right-4 text-white-1 text-xl font-semibold">{item.title}</h4>
              </div>
              <div className="p-6">
                <p className="text-light-gray text-sm">Scroll to explore
Stacked cards showcase.</p>
              </div>
              <div className="pointer-events-none absolute -inset-1 rounded-[1.25rem]" style={{ boxShadow: `0 25px 60px rgba(0,0,0,${transforms.shadowOpacity})` }} />
            </motion.article>
          )
        })}
      </div>
    </section>
  )
}

