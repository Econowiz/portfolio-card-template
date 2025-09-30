# Data-Driven Finance Strategist Portfolio

<div align="center">

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![pnpm](https://img.shields.io/badge/PNPM-4040B2?style=for-the-badge&logo=pnpm&logoColor=white)

**Interactive finance + analytics portfolio showcasing automation workflows, real-time insights, and technical storytelling.**

[🌐 Live Site](https://econowiz.github.io) • [🧠 Blog](https://econowiz.github.io/#/blog) • [🛠️ Setup](#-getting-started)

</div>

---

## ✨ What’s inside

### 🚀 Modular project showcase
- Projects are defined in data files (`public/data/projects/**`) so you can plug in finance cases, analytics prototypes, or ops dashboards without touching the components.
- Attachment/download support via Markdown documents and datasets per project.

### 🧭 Analytics writing & knowledge base
- Blog articles live under `public/data/blog/<slug>` with Markdown + metadata, rendered through a reusable Markdown viewer.
- Designed for long-form narratives, technical deep dives, or lightweight release notes.

### 🧱 Modern technical stack
- React 19 + TypeScript + Vite 7.
- Tailwind utility layer and Framer Motion micro-interactions.
- Plotly + Recharts visualizations loaded lazily for performance.
- EmailJS integration behind environment validation.

---

## 🛠 Getting started

```bash
# Clone your fork (or this repo)
git clone https://github.com/Econowiz/econowiz.github.io.git
cd econowiz.github.io

# Install deps
pnpm install

# Run locally
pnpm run dev
```

Open [http://localhost:5173](http://localhost:5173) and you’re live. The default content points at the Intelligent Financial Close project and two long-form articles.

> **Environment variables** – EmailJS keys are optional locally. In CI/production the build fails if placeholders are used. Set `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, and `VITE_EMAILJS_PUBLIC_KEY` if you need the contact form.

---

## 🧩 Customising

| Area | Location | Notes |
|------|----------|-------|
| Profile copy | `src/components/Sidebar.tsx` & `src/components/sections/About.tsx` | Update headline, availability, and intro paragraph. |
| Projects | `public/data/projects/**` | Each project owns a `metadata.json`, Markdown, datasets, and downloads. Currently only the Intelligent Financial Close system is shipped. |
| Blog | `public/data/blog/<slug>/{metadata.json,content.md}` | Add new articles by duplicating a folder and referencing it in `public/data/blog/index.json`. |
| Assets | `public/images/**` | Store hero images per slug (blog) or project. |
| Theme | `src/index.css`, `src/styles/typography.css`, `tailwind.config.js` | Typography, palette, spacing, etc. |

### Template version
I’m preparing a stripped-down “starter kit” (sans personal data) so others can adapt the layout quickly. Until that repository is published, you can:
1. Fork this repo.
2. Delete `public/data/blog/*` and replace with your own Markdown.
3. Replace `public/data/projects/**` with your case studies.
4. Update copy and assets as above.

When the template repository is live, the README will be updated with a direct link and the one-click “Use this template” badge.

---

## 📦 Project structure

```
│
├── public/
│   ├── data/                  # Blog + project metadata
│   ├── downloads/             # Markdown documents for case study attachments
│   └── images/                # Hero artwork per slug/project
│
├── src/
│   ├── components/
│   │   ├── sections/          # About, Blog, Portfolio, Contact
│   │   ├── interactive/       # Plotly/Recharts dashboards, calculators
│   │   ├── shared/            # UnifiedCard, category styles, etc.
│   │   └── pages/             # MarkdownViewPage
│   ├── data/                  # Typed JSON references
│   ├── styles/                # Tailwind extensions & typography
│   └── polyfills/             # Buffer polyfill for Plotly dependencies
│
└── .github/workflows/         # CI + GitHub Pages deployment
```

---

## 🔁 Deployments & CI
- **GitHub Pages:** `.github/workflows/deploy.yml` builds the site on pushes to `main` (requires EmailJS secrets when enabled).
- **pages.yml:** Handles the official Pages deployment after artifacts upload.
- `pnpm run build` must succeed locally before pushing – large bundle warnings are expected but should stay under control.

---

## 🤝 Contributions
Suggestions, bug fixes, or requests for the upcoming template repo are welcome. Open an issue or a PR:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-update`)
3. Commit (`git commit -m 'Add my update'`)
4. Push and open a pull request

---

## 📄 License & attribution

Licensed under the [MIT License](LICENSE). Feel free to reuse components or configuration with attribution.

Built with ❤️ by [Franck](https://github.com/econowiz)


> ⭐ **If this project helps you, please star the repository.**
