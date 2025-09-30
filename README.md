# Portfolio Card Template (Vite + React + Tailwind, pnpm)

A clean, data‑driven portfolio template. Create project case studies and blog posts from simple JSON + Markdown, no CMS required. Ships with accessible UI, code highlighting, and optional interactive charts.

[Use this template →](https://github.com/Econowiz/portfolio-card-template/generate)

---

## Features
- Content‑first: projects and posts live under `public/data/**`
- Fast stack: React 19 + TypeScript + Vite 7 + pnpm 10
- Styling + motion: Tailwind utilities and Framer Motion micro‑interactions
- Markdown renderer with GitHub‑style code highlighting
- Optional charts (Plotly + Recharts) loaded lazily
- GitHub Pages workflow included

---

## Requirements
- Node.js 20+
- pnpm 10+

---

## Quick Start
```bash
# Create your repo from the template
# Or click: https://github.com/Econowiz/portfolio-card-template/generate

# Then clone your new repo
pnpm install
pnpm dev
```
Open http://localhost:5173

---

## Customize
- Update profile and contact
  - `src/components/Sidebar.tsx`
  - `index.html` (title/meta)
- Change About copy
  - `src/components/sections/About.tsx`
- Add projects
  - `pnpm create-project "Project Title" [category] [type] [duration] [tags...]`
  - Assets in `public/images/projects/<slug>/`
  - Data in `public/data/<slug>/`
- Add blog posts
  - `pnpm create-blog-post "Your Title" [category] [tags...]`
  - Content at `public/data/blog/<slug>/content.md`
  - Image at `public/images/blog/<slug>/hero.webp`

---

## Scripts
- `pnpm dev` — Run the dev server
- `pnpm build` — Production build
- `pnpm build:gh-pages` — Production build for GitHub Pages
- `pnpm create-blog-post` — Scaffold a blog post folder
- `pnpm create-project` — Scaffold a project folder

---

## Deploy (GitHub Pages)
This repo includes `.github/workflows/pages.yml` to build + deploy on pushes to `main`.

- User site (username.github.io): no extra config
- Project site (e.g. my‑portfolio): build with a base path
  ```bash
  GHPAGES_BASE="/my-portfolio/" pnpm run build:gh-pages
  ```
  Or set `GHPAGES_BASE` as a repository/Actions variable.

Enable Pages → Source: GitHub Actions.

---

## Structure
```
public/
  data/                 # Blog + project metadata and datasets
  images/               # Hero images per blog/project
src/
  components/           # Sections, shared cards, interactive charts
  styles/               # Tailwind extensions & typography
  polyfills/            # Buffer polyfill for Plotly deps
```

---

## License
MIT — free to use, modify, and share.
