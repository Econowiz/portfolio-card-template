# GitHub Pages Deployment Guide

## Quick Setup

### 1. Repository Setup
1. Push your code to GitHub
2. Go to Settings > Pages
3. Set Source to "GitHub Actions"

### 2. Environment Variables (Required for Contact Form)
In GitHub repository settings, go to Settings > Secrets and variables > Actions and add:

```
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id  
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

### 3. Deploy
Push to main branch - GitHub Actions will automatically deploy!

## Your site will be available at:
```
https://econowiz.github.io/
```

## Manual Deployment (Alternative)
```bash
# Install gh-pages if needed
pnpm add -D gh-pages

# Deploy manually
pnpm run deploy
```

## Important Changes Made for GitHub Pages:

1. **Router**: Changed from BrowserRouter to HashRouter for GitHub Pages compatibility
2. **Base Path**: Root path configuration for econowiz.github.io
3. **GitHub Actions**: Automated deployment workflow created
4. **Scripts**: Added `build:gh-pages` and `deploy` commands

## Your Animations Are Safe! ✅
- All Framer Motion animations will work perfectly
- Client-side animations don't depend on server
- Static build preserves all interactive features

## Routing Notes:
- URLs will use hash routing: `#/about`, `#/portfolio`, etc.
- All deep links and navigation will work
- Browser back/forward buttons work correctly
- URLs remain shareable and bookmarkable
