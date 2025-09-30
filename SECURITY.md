# Security Configuration

## 🔒 Repository Security Settings

### Required GitHub Repository Settings:

1. **Repository Visibility**: ✅ Public (required for GitHub Pages)

2. **Branch Protection** (Settings > Branches):
   - Protect main branch
   - Require pull request reviews before merging
   - Require status checks to pass before merging
   - Restrict pushes to main branch

3. **Actions Permissions** (Settings > Actions):
   - Allow actions and reusable workflows
   - Allow actions created by GitHub and verified creators

4. **Secrets and Variables** (Settings > Secrets and variables > Actions):
   Add these environment variables:
   ```
   VITE_EMAILJS_SERVICE_ID=your_service_id_here
   VITE_EMAILJS_TEMPLATE_ID=your_template_id_here
   VITE_EMAILJS_PUBLIC_KEY=your_public_key_here
   ```

5. **Security Advisories** (Settings > Security):
   - Enable private vulnerability reporting
   - Enable Dependabot alerts
   - Enable Dependabot security updates

## 🚫 What's NOT Exposed Publicly:

- ✅ Environment variables (stored in GitHub Secrets)
- ✅ Development tools (.serena directory)
- ✅ Personal configuration files
- ✅ Local development environment

## ✅ What's Safely Public:

- Source code (React components)
- Build configuration (package.json, vite.config.ts)
- Documentation
- Public assets (images, icons)
- Example environment files

## 🛡️ EmailJS Security:

Your EmailJS credentials are now secure:
- Not stored in repository
- Added to GitHub Secrets
- Only accessible during GitHub Actions builds
- Can be rotated anytime in EmailJS dashboard

## 👥 Contribution Settings:

- **Issues**: Disabled (it's a personal portfolio)
- **Discussions**: Disabled
- **Pull Requests**: Enabled but require approval
- **Wikis**: Disabled
