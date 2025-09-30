import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface FluidBlobsProps {
  className?: string
}

/**
 * FluidBlobs — lightweight flowing backdrop for hero areas
 * - Uses 2–3 animated blurred blobs with long-duration keyframes
 * - Triggers only when in viewport (whileInView)
 * - Replicates a subtle “liquid” motion similar to Framer sites
 */
export function FluidBlobs({ className }: FluidBlobsProps) {
  return (
    <div className={cn('pointer-events-none select-none', className)}>
      {/* Blob A */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, x: -60, y: -40 }}
        whileInView={{ opacity: 0.6, scale: 1, x: -20, y: -10 }}
        viewport={{ once: false, amount: 0.3 }}
        animate={{
          x: [-20, 20, -10, -20],
          y: [-10, 10, -20, -10],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-10 -left-10 h-56 w-56 rounded-full blur-3xl"
        style={{
          background:
            'radial-gradient(closest-side, rgba(255,165,0,0.28), rgba(255,165,0,0.0))',
        }}
      />

      {/* Blob B */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, x: 40, y: 10 }}
        whileInView={{ opacity: 0.5, scale: 1, x: 20, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        animate={{
          x: [20, -10, 30, 20],
          y: [0, 15, -10, 0],
          scale: [1, 0.95, 1.05, 1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-6 right-6 h-48 w-48 rounded-full blur-3xl"
        style={{
          background:
            'radial-gradient(closest-side, rgba(255,255,255,0.16), rgba(255,255,255,0.0))',
        }}
      />

      {/* Blob C (subtle) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, x: 0, y: 30 }}
        whileInView={{ opacity: 0.35, scale: 1, x: -10, y: 20 }}
        viewport={{ once: false, amount: 0.3 }}
        animate={{
          x: [-10, -20, 10, -10],
          y: [20, -5, 25, 20],
          scale: [1, 1.05, 0.97, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-4 left-1/3 h-40 w-40 -translate-x-1/2 rounded-full blur-3xl"
        style={{
          background:
            'radial-gradient(closest-side, rgba(255,200,50,0.18), rgba(255,200,50,0.0))',
        }}
      />
    </div>
  )
}

export default FluidBlobs

