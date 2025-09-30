#!/usr/bin/env tsx

import { promises as fs } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

interface BlogPostMetadata {
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
  posts: BlogPostMetadata[]
  categories: Array<{
    id: string
    name: string
    description: string
    color: string
  }>
  tags: string[]
}

async function createBlogPost() {
  const args = process.argv.slice(2)
  
  if (args.length === 0) {
    console.log(`
Usage: pnpm create-blog-post "Blog Post Title" [category] [tags...]

Examples:
  pnpm create-blog-post "The Future of Financial Analytics"
  pnpm create-blog-post "Power BI Best Practices" Analytics
  pnpm create-blog-post "Python for Finance" Programming python,finance,automation

Categories: Finance, Analytics, Investment, Automation, International, M&A, Programming
    `)
    process.exit(1)
  }

  const title = args[0]
  const category = args[1] || 'Finance'
  const tags = args.slice(2).join(',').split(',').map(tag => tag.trim()).filter(Boolean)
  
  // Generate slug from title
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()

  const blogDir = path.join(__dirname, '../public/data/blog')
  const postDir = path.join(blogDir, slug)
  const indexPath = path.join(blogDir, 'index.json')

  // Create blog directory structure if it doesn't exist (served from public/data)
  await fs.mkdir(blogDir, { recursive: true })
  await fs.mkdir(postDir, { recursive: true })
  await fs.mkdir(path.join(__dirname, '../public/images/blog', slug), { recursive: true })

  // Create metadata.json
  const metadata: BlogPostMetadata = {
    id: slug,
    title,
    category,
    date: new Date().toISOString().split('T')[0],
    excerpt: `${title} — Add a short teaser here`,
    tags: tags.length > 0 ? tags : [category.toLowerCase()],
    author: 'Franck Rafiou',
    readTime: '5 min read',
    featured: false,
    image: `/images/blog/${slug}/hero.webp`
  }

  await fs.writeFile(
    path.join(postDir, 'metadata.json'),
    JSON.stringify(metadata, null, 2)
  )

  // Create content.md template
  const contentTemplate = `# ${title}

*Published on ${metadata.date} • ${metadata.readTime}*

## Introduction

Write your introduction here...

## Main Content

### Section 1

Your content here...

### Section 2

More content...

## Conclusion

Wrap up your thoughts...

---

**Tags:** ${metadata.tags.map(tag => `#${tag}`).join(' ')}
`

  await fs.writeFile(path.join(postDir, 'content.md'), contentTemplate)

  // Update or create index.json
  let blogIndex: BlogIndex
  try {
    const indexContent = await fs.readFile(indexPath, 'utf-8')
    blogIndex = JSON.parse(indexContent)
  } catch {
    blogIndex = {
      posts: [],
      categories: [
        { id: 'finance', name: 'Finance', description: 'Financial analysis and insights', color: 'blue' },
        { id: 'analytics', name: 'Analytics', description: 'Data analysis and visualization', color: 'green' },
        { id: 'investment', name: 'Investment', description: 'Investment strategies and analysis', color: 'red' },
        { id: 'automation', name: 'Automation', description: 'Process automation and efficiency', color: 'purple' },
        { id: 'international', name: 'International', description: 'Global business insights', color: 'cyan' },
        { id: 'ma', name: 'M&A', description: 'Mergers and acquisitions', color: 'yellow' },
        { id: 'programming', name: 'Programming', description: 'Technical tutorials and guides', color: 'orange' }
      ],
      tags: []
    }
  }

  // Add new post to index (at the beginning for newest first)
  blogIndex.posts.unshift(metadata)

  // Update tags list
  const allTags = new Set(blogIndex.tags)
  metadata.tags.forEach(tag => allTags.add(tag))
  blogIndex.tags = Array.from(allTags).sort()

  // Write updated index
  await fs.writeFile(indexPath, JSON.stringify(blogIndex, null, 2))

  console.log(`✅ Blog post created successfully!`)
  console.log(`📁 Location: ${postDir}`)
  console.log(`📝 Edit content: ${path.join(postDir, 'content.md')}`)
  console.log(`⚙️  Edit metadata: ${path.join(postDir, 'metadata.json')}`)
  console.log(`🖼️  Add hero image: ${path.join(postDir, 'images', 'hero.jpg')}`)
  console.log(`\n🚀 Next steps:`)
  console.log(`1. Edit the content.md file with your blog post`)
  console.log(`2. Update the excerpt in metadata.json`)
  console.log(`3. Add a hero image to the images folder`)
  console.log(`4. Run 'pnpm dev' to see your changes`)
}

createBlogPost().catch(console.error)
