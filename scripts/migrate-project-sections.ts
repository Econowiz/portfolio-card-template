#!/usr/bin/env tsx

import { promises as fs } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)


interface LegacySection {
  id: string
  title: string
  type?: string
  order?: number
  content?: string | { markdown?: string }
  components?: unknown[]
}

interface ContentSection {
  id: string
  title: string
  type: 'content'
  content: { markdown: string; validated: true }
  order: number
}

interface InteractiveSection {
  id: string
  title: string
  type: 'interactive'
  components: unknown[]
  order: number
}

type NormalizedSection = ContentSection | InteractiveSection | LegacySection

async function* walkProjects(dir: string) {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  for (const entry of entries) {
    if (entry.isDirectory()) {
      const metaPath = path.join(dir, entry.name, 'metadata.json')
      try {
        await fs.access(metaPath)
      } catch {
        continue
      }
      yield metaPath
    }
  }
}

function toContentSection(id: string, title: string, markdown: string, order: number): ContentSection {
  return {
    id,
    title,
    type: 'content',
    content: { markdown, validated: true },
    order,
  }
}

function toInteractiveSection(id: string, title: string, components: unknown[], order: number): InteractiveSection {
  return { id, title, type: 'interactive', components, order }
}

async function migrateFile(metaPath: string) {
  const raw = await fs.readFile(metaPath, 'utf-8')
  const data = JSON.parse(raw)

  if (!Array.isArray(data.sections)) {
    console.log(`Skipping (no sections): ${metaPath}`)
    return
  }

  const before = JSON.stringify(data.sections)

  // Sort sections by existing order to keep intent
  const sorted: LegacySection[] = [...data.sections] as LegacySection[]
  sorted.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))

  const next: NormalizedSection[] = []

  for (const sec of sorted) {
    const t = (sec.type ?? '').toLowerCase()

    if (t === 'text') {
      const md = typeof sec.content === 'string' ? sec.content : ''
      next.push(toContentSection(sec.id, sec.title, md, 0))
      continue
    }

    if (t === 'content') {
      // normalize to object with validated: true
      if (typeof sec.content === 'string') {
        next.push(toContentSection(sec.id, sec.title, sec.content, 0))
      } else {
        const markdownSource = sec.content
        const markdown =
          typeof markdownSource === 'object' && markdownSource !== null && 'markdown' in markdownSource &&
          typeof markdownSource.markdown === 'string'
            ? markdownSource.markdown
            : ''
        next.push(toContentSection(sec.id, sec.title, markdown, 0))
      }
      continue
    }

    if (t === 'mixed') {
      const markdownSource = typeof sec.content === 'string' ? sec.content : ''
      const trimmedMarkdown = markdownSource.trim()
      const comps = Array.isArray(sec.components) ? sec.components : []
      const hasComponents = comps.length > 0

      if (trimmedMarkdown.length > 0) {
        next.push(toContentSection(`${sec.id}-content`, sec.title, markdownSource, 0))
      }
      if (hasComponents) {
        next.push(toInteractiveSection(`${sec.id}-interactive`, `${sec.title} — Interactive`, comps, 0))
      }
      // If neither, drop empty section
      continue
    }

    if (t === 'interactive') {
      const comps = Array.isArray(sec.components) ? sec.components : []
      next.push(toInteractiveSection(sec.id, sec.title, comps, 0))
      continue
    }

    // Unknown type: try best-effort conversion
    if (typeof sec.content === 'string') {
      next.push(toContentSection(sec.id, sec.title, sec.content, 0))
    } else if (Array.isArray(sec.components)) {
      next.push(toInteractiveSection(sec.id, sec.title, sec.components, 0))
    } else {
      // keep as-is
      next.push(sec)
    }
  }

  // Reassign clean integer order values
  next.forEach((section, idx) => {
    section.order = idx + 1
  })

  // If unchanged, skip
  const after = JSON.stringify(next)
  if (before === after) {
    console.log(`No change: ${metaPath}`)
    return
  }

  // Backup original
  const backupPath = metaPath.replace(/metadata\.json$/, 'metadata.backup.json')
  await fs.writeFile(backupPath, raw)

  // Write updated
  data.sections = next
  await fs.writeFile(metaPath, JSON.stringify(data, null, 2))
  console.log(`Migrated: ${metaPath}`)
}

async function main() {
  const projectsRoot = path.join(__dirname, '../public/data/projects')
  const slug = process.argv[2]
  try {
    if (slug) {
      const metaPath = path.join(projectsRoot, slug, 'metadata.json')
      await migrateFile(metaPath)
    } else {
      for await (const metaPath of walkProjects(projectsRoot)) {
        await migrateFile(metaPath)
      }
    }
    console.log('\n✅ Migration complete.')
    console.log('Backups were saved as metadata.backup.json next to each file.')
  } catch (e) {
    console.error('Migration failed:', e)
    process.exit(1)
  }
}

main()
