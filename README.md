# Mahmoud - Portfolio Website

Personal portfolio website built with Hugo and the hugo-profile theme.

## Features

- Professional portfolio showcasing penetration testing experience
- Blog section with security research articles
- Courses and certifications display
- Responsive design with dark/light mode
- Visitor counter integration
- Typing animation effects

## Setup

1. Clone the repository
2. Install Hugo (extended version)
3. Run `hugo server` for local development

## Deployment

This site is configured for secure GitHub Pages deployment using GitHub Actions.

### Initial Setup

1. **Enable GitHub Pages:**
   - Go to your repository Settings → Pages
   - Under "Source", select "GitHub Actions"
   - Save the settings

2. **Configure Custom Domain (if using mahmoudouf.com):**
   - In the same Pages settings, add your custom domain: `mahmoudouf.com`
   - GitHub will automatically create/update the CNAME file
   - Configure DNS records as per GitHub's instructions

3. **Push to trigger deployment:**
   - The workflow automatically runs on push to `master` or `main` branch
   - You can also manually trigger it from the Actions tab

### Security Features

- Uses `GITHUB_TOKEN` (no personal tokens required)
- Minimal permissions (read contents, write pages only)
- Automatic dependency updates with version pinning
- Secure artifact handling
- No secrets stored in code

### Workflow Details

The deployment workflow:
- Builds the Hugo site with extended version
- Minifies and optimizes output
- Deploys to GitHub Pages
- Handles custom domain via CNAME automatically

## License

This project uses the hugo-profile theme. See theme license for details.

