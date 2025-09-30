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
    id: 'hello-world',
    title: 'Hello, Portfolio Template',
    category: 'Analytics',
    date: '2025-06-01',
    excerpt: 'A sample post to verify the template layout, typography, and routing.',
    tags: ['template', 'getting-started'],
    author: 'Your Name',
    readTime: '2 min read',
    featured: false,
    image: '/images/blog/hello-world/hero.webp'
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
