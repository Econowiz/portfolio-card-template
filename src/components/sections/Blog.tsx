import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { UnifiedCard, UnifiedGrid } from '../shared'
import { getBlogCategoryStyles } from '../shared/categoryStyles'

interface BlogPost {
  id: string
  title: string
  category: string
  date: string
  excerpt: string
  tags: string[]
  author: string
  readTime: string
  featured: boolean
  image?: string
}

interface BlogIndex {
  posts: BlogPost[]
  categories: Array<{
    id: string
    name: string
    description: string
    color: string
  }>
  tags: string[]
}

// Fallback blog posts (module-level constant for stable reference)
const fallbackBlogPosts: BlogPost[] = [
  {
    id: 'from-excel-to-cloud-the-modern-finance-stack-revolution',
    title: 'From Excel to Cloud: The Modern Finance Stack Revolution',
    category: 'Finance',
    date: '2025-03-22',
    excerpt: 'How finance teams graduate from spreadsheet sprawl to a modern cloud-first stack without losing Excel.',
    tags: ['python', 'cloud', 'automation'],
    author: 'Franck Rafiou',
    readTime: '8 min read',
    featured: false,
    image: '/images/blog/from-excel-to-cloud-the-modern-finance-stack-revolution/hero.webp'
  },
  {
    id: 'the-rise-of-real-time-financial-intelligence',
    title: 'The Rise of Real-Time Financial Intelligence',
    category: 'Analytics',
    date: '2025-03-15',
    excerpt: 'Discover how real-time data streams and AI-powered analytics are transforming finance from periodic reporting to continuous intelligence.',
    tags: ['AI', 'real-time', 'dashboards'],
    author: 'Franck Rafiou',
    readTime: '7 min read',
    featured: false
  }
]

const Blog = () => {
  const navigate = useNavigate()
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error] = useState<string | null>(null)

  // Load blog posts from data file
  useEffect(() => {
    const loadBlogPosts = async () => {
      try {
        const response = await fetch('/data/blog/index.json')
        if (response.ok) {
          const blogIndex: BlogIndex = await response.json()
          setBlogPosts(blogIndex.posts)
        } else {
          // Fallback to hardcoded posts if no blog data exists yet
          setBlogPosts(fallbackBlogPosts)
        }
      } catch {
        // Fallback to hardcoded posts
        setBlogPosts(fallbackBlogPosts)
      } finally {
        setLoading(false)
      }
    }

    loadBlogPosts()
  }, [])


  if (loading) {
    return (
      <div className="space-y-8">
        <div className="text-center py-12">
          <p className="body-normal">Loading blog posts...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="text-center py-12">
          <p className="body-normal text-red-400">Error loading blog posts: {error}</p>
        </div>
      </div>
    )
  }

  const formatDate = (value: string) => {
    const parsed = new Date(value)
    if (Number.isNaN(parsed.getTime())) {
      return value
    }

    return parsed.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const handleBlogClick = (postId: string) => {
    const post = blogPosts.find((p) => p.id === postId)
    if (!post) return

    const markdownPath = `/data/blog/${post.id}/content.md`
    navigate(`/view?path=${encodeURIComponent(markdownPath)}`)
  }

  return (
    <section className="space-y-8" aria-labelledby="blog-title">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 id="blog-title" className="page-title text-left">Blog</h2>

        <div className="h-0.5 w-12 bg-orange-yellow mb-6"></div>
      </motion.div>

      {/* Blog Posts Grid */}
      <UnifiedGrid>
        {blogPosts.map((post, index) => (
          <UnifiedCard
            key={post.id}
            title={post.title}
            category={post.category}
            description={post.excerpt}
            image={post.image}
            date={formatDate(post.date)}
            tags={post.tags}
            index={index}
            getCategoryColor={getBlogCategoryStyles}
            onCardClick={() => handleBlogClick(post.id)}
          />
        ))}
      </UnifiedGrid>
    </section>
  )
}

export default Blog
