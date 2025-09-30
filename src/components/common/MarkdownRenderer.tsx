import React, { useEffect, useRef } from 'react'
import { marked } from 'marked'
import 'highlight.js/styles/github-dark-dimmed.css'

interface MarkdownRendererProps {
  content: string
  className?: string
}

// Configure marked for better security and formatting
const configureMarked = () => {
  marked.setOptions({
    breaks: true, // Convert \n to <br>
    gfm: true,    // GitHub flavored markdown
  })
}

// Initialize marked configuration
configureMarked()

const sanitizeHtml = (dirty: string): string => {
  if (typeof window === 'undefined' || typeof window.DOMParser === 'undefined') {
    return dirty
  }

  try {
    const parser = new window.DOMParser()
    const doc = parser.parseFromString(dirty, 'text/html')

    const blockedTags = ['script', 'style', 'iframe', 'object', 'embed']
    blockedTags.forEach((tag) => {
      doc.querySelectorAll(tag).forEach((el) => el.remove())
    })

    const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_ELEMENT)
    while (walker.nextNode()) {
      const element = walker.currentNode as Element
      Array.from(element.attributes).forEach((attr) => {
        const name = attr.name.toLowerCase()
        const value = attr.value.trim().toLowerCase()

        if (name.startsWith('on') || name === 'srcdoc') {
          element.removeAttribute(attr.name)
          return
        }

        if ((name === 'href' || name === 'xlink:href' || name === 'src') && value.startsWith('javascript:')) {
          element.removeAttribute(attr.name)
        }
      })
    }

    return doc.body.innerHTML
  } catch {
    return dirty
  }
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null)

  const parseMarkdown = (markdown: string): string => {
    try {
      const rawHtml = marked(markdown) as string
      return sanitizeHtml(rawHtml)
    } catch (error) {
      console.error('Markdown parsing error:', error)
      // Fallback to plain text with line breaks
      return markdown.replace(/\n/g, '<br>')
    }
  }

  const htmlContent = parseMarkdown(content)

  // Highlight code blocks after content updates
  useEffect(() => {
    const run = async () => {
      type HighlightModule = { highlightElement: (element: Element) => void }

      try {
        const mod = await import('highlight.js')
        const hljsModule = mod as unknown as HighlightModule & { default?: HighlightModule }
        const hljs = hljsModule.default ?? hljsModule

        if (typeof hljs.highlightElement === 'function') {
          containerRef.current?.querySelectorAll('pre code')?.forEach((el) => {
            hljs.highlightElement(el)
          })
        }
      } catch (e) {
        console.warn('Syntax highlighting failed to load/apply', e)
      }
    }
    run()
  }, [htmlContent])

  return (
    <div ref={containerRef}
      className={`
        markdown-content
        /* Enhanced Headings */
        [&>h2]:text-lg [&>h2]:font-semibold [&>h2]:text-white-1 [&>h2]:mb-4 [&>h2]:mt-6 [&>h2:first-child]:mt-0
        [&>h3]:text-base [&>h3]:font-semibold [&>h3]:text-orange-yellow [&>h3]:mb-3 [&>h3]:mt-5

        /* Better Paragraph Spacing */
        [&>p]:text-light-gray [&>p]:leading-relaxed [&>p]:mb-4 [&>p]:text-sm

        /* Improved Lists */
        [&>ul]:mb-6 [&>ul]:ml-4
        [&>li]:text-light-gray [&>li]:text-sm [&>li]:leading-relaxed [&>li]:mb-2 [&>li]:pl-2
        [&>li]:relative [&>li]:before:absolute [&>li]:before:left-[-16px] [&>li]:before:content-['•']
        [&>li]:before:text-orange-yellow [&>li]:before:font-bold [&>li]:before:text-base


        /* Code Blocks */
        [&_pre]:bg-jet [&_pre]:rounded-lg [&_pre]:p-4 [&_pre]:overflow-x-auto [&_pre]:my-4
        [&_code.hljs]:text-sm [&_code.hljs]:leading-relaxed

        /* Enhanced Typography */
        [&>strong]:text-white-1 [&>strong]:font-semibold [&>strong]:bg-jet [&>strong]:px-1 [&>strong]:py-0.5 [&>strong]:rounded
        [&>em]:text-orange-yellow [&>em]:italic [&>em]:font-medium
        ${className}
      `}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  )
}

export default MarkdownRenderer
