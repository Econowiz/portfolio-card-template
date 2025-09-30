import React from 'react'
import { motion } from 'framer-motion'
import type { ProjectSection, ContentSection, InteractiveSection } from '../../types'
import { MarkdownRenderer } from '../content'
import { ComponentRenderer } from '../interactive'

interface SectionRendererProps {
  section: ProjectSection
  index: number
}

/**
 * Clean section renderer following Open/Closed Principle
 * Uses type discrimination to render appropriate section types
 * Eliminates the "mixed" type anti-pattern
 */
const SectionRenderer: React.FC<SectionRendererProps> = ({ section, index }) => {
  const renderSectionContent = () => {
    switch (section.type) {
      case 'content':
        return renderContentSection(section as ContentSection)
      case 'interactive':
        return renderInteractiveSection(section as InteractiveSection)
      default:
        // TypeScript ensures exhaustiveness
        return null
    }
  }

  const renderContentSection = (section: ContentSection) => {
    return <MarkdownRenderer content={section.content.markdown} />
  }

  const renderInteractiveSection = (section: InteractiveSection) => {
    return (
      <div className="space-y-6">
        {section.components.map((component) => (
          <ComponentRenderer
            key={component.id}
            component={component}
            className="w-full"
          />
        ))}
      </div>
    )
  }

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
      {renderSectionContent()}
    </motion.div>
  )
}

export default SectionRenderer
