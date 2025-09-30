# Content Management Guide

This guide explains how to efficiently add blog posts and projects to your portfolio website without hardcoding.

## 🚀 Quick Start

### Creating a New Blog Post

```bash
# Basic blog post
pnpm create-blog-post "My New Blog Post Title"

# With category and tags
pnpm create-blog-post "Advanced Python Techniques" Programming python,advanced,tutorial
```

### Creating a New Project

```bash
# Basic project
pnpm create-project "My New Project"

# Full specification
pnpm create-project "Revenue Dashboard" "Business Intelligence" "dashboard" "3 months" powerbi,dashboard,analytics
```

## 📝 Blog Post Workflow

### 1. Create the Blog Post Structure
```bash
pnpm create-blog-post "The Future of AI in Finance" Finance ai,finance,future
```

This creates:
```
src/data/blog/the-future-of-ai-in-finance/
├── metadata.json          # Post metadata (title, date, tags, etc.)
├── content.md            # Full blog post content in Markdown
└── images/               # Post-specific images
    └── hero.jpg          # Hero image for the post
```

### 2. Write Your Content
- **Edit `content.md`**: Write your blog post in Markdown
- **Update `metadata.json`**: Customize title, excerpt, tags, etc.
- **Add images**: Place hero image and other images in the `images/` folder

### 3. Publish
- Commit and push to Git
- Your blog post automatically appears on the website

## 🚀 Project Workflow

### 1. Create the Project Structure
```bash
pnpm create-project "Customer Analytics Dashboard" "Business Intelligence" "dashboard" "4 months" python,analytics,dashboard
```

This creates:
```
src/data/projects/customer-analytics-dashboard/
├── metadata.json         # Rich project metadata with sections
├── datasets/            # Project datasets (CSV, JSON)
│   └── main-data.json   # Sample dataset
├── images/              # Project images
└── attachments/         # PDFs, Excel files, etc.
```

### 2. Customize Your Project
- **Edit `metadata.json`**: Update project details, add interactive components
- **Add datasets**: Place your CSV/JSON data files in `datasets/`
- **Add images**: Hero image, screenshots, diagrams
- **Add attachments**: Reports, templates, documentation

### 3. Interactive Components (Optional)
Add charts, calculators, dashboards by editing the `components` section in `metadata.json`:

```json
{
  "components": [
    {
      "id": "roi-calculator",
      "title": "ROI Calculator",
      "type": "calculator",
      "config": {
        "type": "roi",
        "fields": [
          {
            "id": "investment",
            "label": "Initial Investment",
            "type": "currency",
            "defaultValue": 10000
          }
        ],
        "formula": "investment * 0.15",
        "resultFormat": "currency"
      }
    }
  ]
}
```

## 📁 File Structure

```
src/data/
├── blog/
│   ├── index.json                    # Blog posts index
│   ├── post-slug-1/
│   │   ├── metadata.json
│   │   ├── content.md
│   │   └── images/
│   └── post-slug-2/
│       ├── metadata.json
│       ├── content.md
│       └── images/
└── projects/
    ├── index.json                    # Projects index
    ├── project-slug-1/
    │   ├── metadata.json
    │   ├── datasets/
    │   ├── images/
    │   └── attachments/
    └── project-slug-2/
        ├── metadata.json
        ├── datasets/
        ├── images/
        └── attachments/
```

## 🎯 Best Practices

### Blog Posts
1. **Write in Markdown**: Use standard Markdown syntax for formatting
2. **SEO-friendly titles**: Clear, descriptive titles
3. **Good excerpts**: Write compelling 1-2 sentence excerpts
4. **Relevant tags**: Use consistent, relevant tags
5. **Hero images**: Add engaging hero images (recommended: 1200x600px)

### Projects
1. **Rich descriptions**: Tell the full story of your project
2. **Include datasets**: Add real or sample data to make projects interactive
3. **Visual assets**: Include screenshots, diagrams, before/after images
4. **Quantify results**: Use specific metrics and numbers
5. **Interactive elements**: Add calculators, charts, or dashboards when relevant

### General
1. **Consistent naming**: Use kebab-case for slugs (my-blog-post, not My Blog Post)
2. **Version control**: Commit content changes to track history
3. **Image optimization**: Optimize images for web (WebP format recommended)
4. **Regular updates**: Keep content fresh and up-to-date

## 🔧 Advanced Features

### Interactive Project Components
- **Charts**: Line, bar, pie charts with real data
- **Calculators**: ROI, cost-benefit, risk assessment calculators
- **Dashboards**: Multi-widget dashboards with metrics and charts
- **Comparisons**: Before/after, side-by-side comparisons
- **Simulations**: Monte Carlo, scenario analysis

### Content Types
- **Standard projects**: Traditional case studies
- **Interactive projects**: Projects with calculators and charts
- **Dashboards**: Multi-widget interactive dashboards
- **Case studies**: Detailed problem-solution-results format

## 🚀 Deployment

Your content is automatically deployed when you:
1. Commit changes to Git
2. Push to your repository
3. GitHub Pages automatically rebuilds and deploys

No manual deployment steps needed!

## 🆘 Troubleshooting

### Blog post not showing?
- Check that `metadata.json` is valid JSON
- Ensure the post is added to `src/data/blog/index.json`
- Verify image paths are correct

### Project not loading?
- Validate `metadata.json` structure
- Check that project is listed in `src/data/projects/index.json`
- Ensure all referenced datasets exist

### Interactive components not working?
- Validate component configuration in `metadata.json`
- Check that referenced datasets are properly formatted
- Verify component type is supported

## Need Help?

If you encounter issues:
1. Check the browser console for errors
2. Validate JSON files using a JSON validator
3. Ensure all file paths are correct and files exist
4. Check that image files are in the correct format and location
