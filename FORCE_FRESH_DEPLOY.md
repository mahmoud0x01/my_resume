# Force Fresh Deployment - Fix Old Content Issue

## The Problem
Local Hugo server shows correct content, but GitHub Pages shows old content.

## Root Causes
1. GitHub Pages might be serving from old `gh-pages` branch
2. GitHub Pages cache is serving stale content
3. Workflow might not be running or completing properly

## Solution Steps

### Step 1: Delete Old gh-pages Branch (if exists)
```bash
# Check if gh-pages branch exists
git branch -a | grep gh-pages

# If it exists, delete it
git push origin --delete gh-pages
```

### Step 2: Verify GitHub Pages Settings
1. Go to your repository on GitHub
2. **Settings** → **Pages**
3. Under **Source**, make sure it says:
   - ✅ **GitHub Actions** (NOT "Deploy from a branch")
   - If it says "Deploy from a branch", change it to "GitHub Actions"

### Step 3: Clear All Caches and Force Rebuild

**Option A: Via GitHub UI**
1. Go to **Settings** → **Pages**
2. Under **Custom domain**, remove it temporarily
3. Save
4. Wait 1 minute
5. Add domain back
6. Save

**Option B: Force Workflow Run**
1. Go to **Actions** tab
2. Click **Deploy Hugo site to Pages** workflow
3. Click **Run workflow** → **Run workflow** (manual trigger)
4. Wait for it to complete

### Step 4: Add Cache Busting (if needed)

The workflow now includes:
- Complete cleanup before build
- `--cleanDestinationDir` flag
- Verification step to check what's being built

### Step 5: Verify What's Being Deployed

After workflow runs, check the "Verify build content" step in Actions to see what files are actually being built.

## Quick Fix Commands

```bash
# Make sure everything is committed
git add .
git commit -m "Force fresh deployment - fix old content"
git push origin master

# Then manually trigger workflow in GitHub UI
```

## If Still Not Working

1. **Check Actions Logs**: Look at the workflow run logs to see what's actually being built
2. **Check Pages Source**: Make absolutely sure it's set to "GitHub Actions" not a branch
3. **Wait Longer**: Sometimes GitHub Pages CDN takes 5-10 minutes to update
4. **Test in Incognito**: Make sure it's not browser cache

The workflow is now configured to build completely fresh every time, so the issue is likely GitHub Pages serving from wrong source or cache.

