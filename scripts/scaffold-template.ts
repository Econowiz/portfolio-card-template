#!/usr/bin/env tsx

import { promises as fs } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const repoRoot = path.join(__dirname, '..')
const destRoot = path.join(repoRoot, '..', 'template-export')

async function exists(p: string) {
  try { await fs.stat(p); return true } catch { return false }
}

async function emptyDir(dir: string) {
  if (!(await exists(dir))) return
  const entries = await fs.readdir(dir)
  await Promise.all(entries.map(async (entry) => {
    const full = path.join(dir, entry)
    const st = await fs.lstat(full)
    if (st.isDirectory()) await fs.rm(full, { recursive: true, force: true })
    else await fs.rm(full, { force: true })
  }))
}

async function copyRepo() {
  // Fresh export dir
  await fs.mkdir(destRoot, { recursive: true })
  await emptyDir(destRoot)

  // fs.cp with filtering
  await fs.cp(repoRoot, destRoot, {
    recursive: true,
    filter: (src) => {
      const rel = path.relative(repoRoot, src)
      if (!rel) return true
      // Exclude VCS/build/artifacts and local caches
      const deny = [
        '.git',
        'node_modules',
        'dist',
        '.pnpm-store',
        '.serena',
        'tests/artifacts',
        'bundle-analysis.html',
        'bundle-analysis.json'
      ]
      if (deny.some((d) => rel === d || rel.startsWith(d + path.sep))) return false
      return true
    }
  })
}

async function writeJson(file: string, obj: unknown) {
  await fs.mkdir(path.dirname(file), { recursive: true })
  await fs.writeFile(file, JSON.stringify(obj, null, 2))
}

async function replaceInFile(filePath: string, replacements: Array<{ from: RegExp, to: string }>) {
  if (!(await exists(filePath))) return
  const content = await fs.readFile(filePath, 'utf-8')
  let out = content
  for (const { from, to } of replacements) out = out.replace(from, to)
  await fs.writeFile(filePath, out)
}

async function sanitizeTemplate() {
  // 1) Public data → reset to placeholders
  await writeJson(path.join(destRoot, 'public/data/blog/index.json'), {
    posts: [],
    categories: [
      { id: 'finance', name: 'Finance', description: 'Financial analysis and insights', color: 'blue' },
      { id: 'analytics', name: 'Analytics', description: 'Data analysis and visualization', color: 'green' }
    ],
    tags: []
  })

  // Remove all blog posts and images (keep dirs)
  await fs.rm(path.join(destRoot, 'public/data/blog'), { recursive: true, force: true })
  await fs.mkdir(path.join(destRoot, 'public/data/blog'), { recursive: true })

  await fs.rm(path.join(destRoot, 'public/images/blog'), { recursive: true, force: true })
  await fs.mkdir(path.join(destRoot, 'public/images/blog/sample-post'), { recursive: true })
  // Note: we don't embed a binary placeholder; users can add hero.webp later

  // Projects index minimal
  const projectsDir = path.join(destRoot, 'public/data/projects')
  if (await exists(projectsDir)) {
    await writeJson(path.join(projectsDir, 'index.json'), { projects: [] })
    // Remove project subdirs if present
    const entries = await fs.readdir(projectsDir)
    await Promise.all(entries.map(async (e) => {
      if (e !== 'index.json') await fs.rm(path.join(projectsDir, e), { recursive: true, force: true })
    }))
  }

  // 2) Scrub personal images
  const imagesRoot = path.join(destRoot, 'public/images')
  if (await exists(imagesRoot)) {
    for (const name of ['franck-avatar.JPG', 'franck-contact.png', 'franck-portrait.jpg']) {
      await fs.rm(path.join(imagesRoot, name), { force: true })
    }
  }

  // 3) Replace personal identifiers in index.html
  await replaceInFile(path.join(destRoot, 'index.html'), [
    { from: /Franck Rafiou/g, to: 'Your Name' },
    { from: /econowiz\.github\.io/g, to: 'your-username.github.io' },
    { from: /Strategic Finance & Analytics professional[^"]*/g, to: 'Your professional tagline here' },
  ])

  // 4) Replace personal identifiers in Sidebar
  const sidebarFile = path.join(destRoot, 'src/components/Sidebar.tsx')
  await replaceInFile(sidebarFile, [
    { from: /Franck Rafiou/g, to: 'Your Name' },
    { from: /franck@aethelstone\.com/g, to: 'you@example.com' },
    { from: /linkedin\.com\/in\/rafiou/g, to: 'linkedin.com/in/your-handle' },
    { from: /github\.com\/Econowiz/g, to: 'github.com/your-handle' },
    { from: /Lucerne, Switzerland • UTC\+1/g, to: 'Your City, Country • UTC±0' },
    { from: /Data-Driven Finance Strategist/g, to: 'Your Role or Tagline' },
    { from: /\/images\/franck-portrait\.jpg/g, to: '/images/placeholder-portrait.jpg' }
  ])

  // 5) README: add template instructions without overwriting original content
  const templateReadme = `# Portfolio Card Template

This is a clean template derived from the original portfolio project.

Quick start:
- pnpm install
- pnpm dev

Customization checklist:
- Update index.html title, meta tags, and canonical URL
- Edit src/components/Sidebar.tsx (name, email, links, tagline)
- Add your images under public/images/
- Create blog posts via \`pnpm create-blog-post "Your Title"\`
- Create projects via \`pnpm create-project "Project Title"\`

Deploy to GitHub Pages:
- Push to a new repository
- Enable GitHub Pages (Actions)
- The included workflow will build and deploy on pushes to main
`
  await fs.writeFile(path.join(destRoot, 'TEMPLATE_README.md'), templateReadme)
}

async function main() {
  console.log('Exporting sanitized template to:', destRoot)
  await copyRepo()
  await sanitizeTemplate()
  console.log('✅ Template export ready at:', destRoot)
}

main().catch((err) => {
  console.error('Scaffold failed:', err)
  process.exit(1)
})
