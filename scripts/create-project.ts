#!/usr/bin/env tsx

import { promises as fs } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

interface ProjectMetadata {
  id: string
  title: string
  category: string
  type: 'standard' | 'interactive' | 'case-study' | 'dashboard'
  description: string
  tags: string[]
  duration: string
  client?: string
  hero_image?: string
  hasInteractive: boolean
  featured: boolean
  order: number
}

interface ProjectsIndex { projects: ProjectMetadata[] }


async function createProject() {
  const args = process.argv.slice(2)

  if (args.length === 0) {
    console.log(`
Usage: pnpm create-project "Project Title" [category] [type] [duration] [tags...]

Examples:
  pnpm create-project "Revenue Analysis Dashboard"
  pnpm create-project "Cost Optimization Study" "Business Intelligence" "case-study" "2 months"
  pnpm create-project "ML Forecasting Model" "Financial Analytics" "interactive" "4 months" python,ml,forecasting

Categories: Financial Analytics, Business Intelligence, Investment Analysis, Process Automation
Types: standard, interactive, case-study, dashboard
    `)
    process.exit(1)
  }

  const title = args[0]
  const category = args[1] || 'Financial Analytics'
  const typeInput = args[2] as string | undefined
  const allowedTypes = ['standard','interactive','case-study','dashboard'] as const
  type AllowedType = typeof allowedTypes[number]
  const type: ProjectMetadata['type'] = allowedTypes.includes((typeInput ?? '') as AllowedType)
    ? (typeInput as ProjectMetadata['type'])
    : 'standard'
  const duration = args[3] || '3 months'
  const tags = args.slice(4).join(',').split(',').map(tag => tag.trim()).filter(Boolean)

  // Generate slug from title
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()

  const projectsDir = path.join(__dirname, '../public/data/projects')
  const projectDir = path.join(projectsDir, slug)
  const indexPath = path.join(projectsDir, 'index.json')
  // Raw data files are served from /data/<slug>
  const dataRoot = path.join(__dirname, '../public/data', slug)

  // Create data directories (public served)
  await fs.mkdir(projectDir, { recursive: true })
  await fs.mkdir(dataRoot, { recursive: true })
  await fs.mkdir(path.join(__dirname, '../public/images/projects', slug), { recursive: true })

  // Read existing index to get next order number
  let existingIndex: ProjectsIndex
  try {
    const indexContent = await fs.readFile(indexPath, 'utf-8')
    existingIndex = JSON.parse(indexContent)
  } catch {
    existingIndex = { projects: [] }
  }

  const nextOrder = Math.max(...existingIndex.projects.map((p) => p.order || 0), 0) + 1

  // Create comprehensive metadata.json template
  const metadata = {
    id: slug,
    title,
    category,
    type,
    description: `${title} - Add your project description here`,
    tags: tags.length > 0 ? tags : [category.toLowerCase().replace(/\s+/g, '-')],
    duration,
    client: 'Client Name',
    hero_image: `/images/projects/${slug}/hero.jpg`,
    gallery: [
      `/images/projects/${slug}/overview.jpg`,
      `/images/projects/${slug}/results.jpg`,
      `/images/projects/${slug}/dashboard.jpg`
    ],
    sections: [
      {
        id: 'overview',
        title: 'Project Overview',
        type: 'content',
        content: {
          markdown: `## Challenge\n\nDescribe the main challenge or problem this project addressed...\n\n### Key Pain Points:\n- Pain point 1\n- Pain point 2\n- Pain point 3`,
          validated: true
        },
        order: 1
      },
      {
        id: 'solution',
        title: 'Solution & Approach',
        type: 'content',
        content: {
          markdown: `## The Solution\n\nDescribe your approach and solution...\n\n### Technologies Used:\n- **Technology 1**: Description\n- **Technology 2**: Description\n- **Technology 3**: Description`,
          validated: true
        },
        order: 2
      },
      {
        id: 'results',
        title: 'Results & Impact',
        type: 'interactive',
        components: [
          {
            id: 'impact-metrics',
            title: 'Project Impact Metrics',
            type: 'dashboard',
            config: {
              title: `${title} Impact`,
              layout: 'grid',
              widgets: [
                {
                  id: 'key-metric-1',
                  title: 'Key Metric 1',
                  type: 'metric',
                  size: 'medium',
                  config: {
                    value: 0,
                    label: 'Metric Label',
                    format: 'percentage',
                    trend: {
                      value: 0,
                      direction: 'up',
                      label: 'Improvement description'
                    },
                    color: '#22c55e'
                  },
                  position: { x: 0, y: 0, w: 6, h: 3 }
                }
              ]
            }
          }
        ],
        order: 3
      }
    ],
    datasets: [
      {
        id: 'main-dataset',
        name: 'Main Project Dataset',
        path: `/data/${slug}/main-data.json`,
        type: 'json',
        description: 'Primary dataset used in this project'
      }
    ],
    attachments: [
      {
        id: 'project-summary',
        name: 'Project Summary Report',
        path: `/downloads/${slug}-summary.pdf`,
        type: 'pdf',
        description: 'Comprehensive project summary and findings'
      }
    ]
  }

  await fs.writeFile(
    path.join(projectDir, 'metadata.json'),
    JSON.stringify(metadata, null, 2)
  )

  // Create sample dataset
  const sampleData = [
    { month: 'Jan', before: 100, after: 85 },
    { month: 'Feb', before: 95, after: 80 },
    { month: 'Mar', before: 110, after: 90 }
  ]

  await fs.writeFile(
    path.join(dataRoot, 'main-data.json'),
    JSON.stringify(sampleData, null, 2)
  )

  // Update projects index
  const projectSummary: ProjectMetadata = {
    id: slug,
    title,
    category,
    type,
    description: metadata.description,
    tags: metadata.tags,
    duration,
    client: metadata.client,
    hero_image: metadata.hero_image,
    hasInteractive: type === 'interactive' || type === 'dashboard',
    featured: false,
    order: nextOrder
  }

  existingIndex.projects.push(projectSummary)
  existingIndex.projects.sort((a, b) => a.order - b.order)

  await fs.writeFile(indexPath, JSON.stringify(existingIndex, null, 2))

  console.log(`✅ Project created successfully!`)
  console.log(`📁 Location: ${projectDir}`)
  console.log(`📝 Edit metadata: ${path.join(projectDir, 'metadata.json')}`)
  console.log(`📊 Add datasets: ${path.join(__dirname, '../public/data', slug)}`)
  console.log(`🖼️  Add images (optional): ${path.join(__dirname, '../public/images/projects', slug)}`)
  console.log(`📎 Add attachments (optional): ${path.join(__dirname, '../public/downloads')}`)
  console.log(`\n🚀 Next steps:`)
  console.log(`1. Edit metadata.json with your project details`)
  console.log(`2. Add your datasets to public/data/${slug}`)
  console.log(`3. Add project images under public/images/projects/${slug} (match the paths in metadata)`)
  console.log(`4. Configure interactive components if needed`)
  console.log(`5. Run 'pnpm dev' to see your changes`)
}

createProject().catch(console.error)
