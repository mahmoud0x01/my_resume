# GitHub Pages Deployment Guide

## Issue: Old Content Showing on Live Site

If you're seeing old content on your GitHub Pages site, follow these steps:

### 1. Clean Up Old Commits (if public/ was previously committed)

If the `public/` directory was previously committed to git:

```bash
# Remove public directory from git history (if it was committed)
git rm -r --cached public/
git commit -m "Remove public directory from git tracking"
```

### 2. Ensure .gitignore is Working

The `public/` directory should be in `.gitignore` and never committed. The GitHub Actions workflow will build it fresh each time.

### 3. Clear GitHub Pages Cache

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Pages**
3. Under **Custom domain**, temporarily remove and re-add your domain (or just save)
4. This forces GitHub to clear the cache

### 4. Force Rebuild

1. Go to **Actions** tab in your repository
2. Click on the latest workflow run
3. Click **Re-run jobs** → **Re-run all jobs**

### 5. Verify Workflow is Running

The workflow should:
- Clean the `public/` directory
- Build fresh from your `content/` directory
- Deploy only the current content

### 6. Check for Old Branches

If you have a `gh-pages` branch with old content:

```bash
# Delete old gh-pages branch (if it exists)
git push origin --delete gh-pages
```

The new GitHub Actions workflow doesn't use the `gh-pages` branch - it deploys directly to GitHub Pages.

### 7. Verify Content

Make sure your `content/blogs/` directory only contains:
- `computer-security-binary-hacking-concepts-and-basics.md`
- `evade-network-scanners-with-firewall.md`
- `two-captcha-bypasses-idor-and-token-reuse.md`

Old example posts should be deleted.

## Current Setup

- ✅ `public/` is in `.gitignore` (not committed)
- ✅ GitHub Actions workflow cleans `public/` before building
- ✅ Workflow builds fresh from source on every push
- ✅ Custom domain configured via `static/CNAME`

## Next Steps

1. Commit and push all changes
2. Check GitHub Actions workflow runs successfully
3. Wait a few minutes for deployment
4. Clear browser cache and check the live site

