# GitHub Pages Deployment Guide

This guide explains how to securely deploy this Hugo site to GitHub Pages.

## Prerequisites

- A GitHub repository (this one)
- GitHub Pages enabled in repository settings
- (Optional) A custom domain configured

## Security Features

The deployment workflow is designed with security best practices:

1. **No Personal Tokens Required**: Uses GitHub's built-in `GITHUB_TOKEN`
2. **Minimal Permissions**: Only requests read access to contents and write access to pages
3. **Version Pinning**: All actions use specific versions to prevent supply chain attacks
4. **No Secrets in Code**: All authentication is handled by GitHub automatically
5. **Concurrency Control**: Prevents multiple deployments from running simultaneously

## Setup Steps

### 1. Enable GitHub Pages

1. Navigate to your repository on GitHub
2. Go to **Settings** → **Pages**
3. Under **Source**, select **GitHub Actions** (not "Deploy from a branch")
4. Click **Save**

### 2. Configure Custom Domain (Optional)

If you're using a custom domain (e.g., `mahmoudouf.com`):

1. In the Pages settings, under **Custom domain**, enter your domain
2. Check **Enforce HTTPS** (recommended)
3. Configure DNS records:
   - **A records**: Point to GitHub Pages IPs:
     - `185.199.108.153`
     - `185.199.109.153`
     - `185.199.110.153`
     - `185.199.111.153`
   - **OR CNAME record**: Point to `yourusername.github.io`
4. Wait for DNS propagation (can take up to 24 hours)
5. GitHub will automatically create/update the CNAME file

### 3. Update baseURL (if needed)

The `hugo.yaml` file currently has:
```yaml
baseURL: "https://mahmoudouf.com/"
```

If you're using GitHub Pages without a custom domain, update this to:
```yaml
baseURL: "https://yourusername.github.io/"
```

The workflow will automatically use the correct baseURL during build.

### 4. Push to Deploy

1. Commit and push your changes:
   ```bash
   git add .
   git commit -m "Configure GitHub Pages deployment"
   git push origin master
   ```

2. The workflow will automatically:
   - Build your Hugo site
   - Deploy to GitHub Pages
   - Handle the custom domain

3. Monitor the deployment:
   - Go to **Actions** tab in your repository
   - Watch the workflow run
   - Check for any errors

## Workflow Details

The `.github/workflows/deploy.yml` workflow:

- **Triggers**: 
  - Push to `master` or `main` branch
  - Manual trigger via workflow_dispatch
- **Build Process**:
  - Checks out code with submodules (for theme)
  - Sets up Hugo extended version
  - Builds with minification and optimization
  - Uploads artifact
- **Deployment**:
  - Uses GitHub's official Pages deployment action
  - Automatically handles CNAME for custom domains
  - Provides deployment URL

## Troubleshooting

### Build Fails

1. Check the Actions tab for error messages
2. Verify Hugo extended version is available
3. Ensure all dependencies are in the repository
4. Check that the theme submodule is properly configured

### Custom Domain Not Working

1. Verify DNS records are correct
2. Check that the domain is added in Pages settings
3. Wait for DNS propagation (up to 24 hours)
4. Check the CNAME file in the repository

### Site Not Updating

1. Check if the workflow completed successfully
2. Clear browser cache
3. Verify the baseURL matches your domain
4. Check GitHub Pages settings for any errors

## Security Notes

- The workflow uses `GITHUB_TOKEN` which is automatically provided by GitHub
- No personal access tokens or secrets are required
- Permissions are set to the minimum required
- All actions use pinned versions for security
- The workflow runs in isolated GitHub-hosted runners

## Manual Deployment

You can also manually trigger the workflow:

1. Go to **Actions** tab
2. Select **Deploy to GitHub Pages** workflow
3. Click **Run workflow**
4. Select branch and click **Run workflow**

## Updating the Site

Simply push changes to the `master` or `main` branch:

```bash
git add .
git commit -m "Update site content"
git push origin master
```

The workflow will automatically rebuild and redeploy.

