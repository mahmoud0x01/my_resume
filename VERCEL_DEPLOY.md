# Deploy to Vercel

This guide explains how to deploy your Hugo portfolio site to Vercel.

## Prerequisites

1. A Vercel account ([vercel.com](https://vercel.com))
2. Your repository pushed to GitHub, GitLab, or Bitbucket
3. Hugo Extended version installed (Vercel will auto-detect and install it)

## Quick Setup Steps

### 1. Import Project to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New..."** → **"Project"**
3. Import your Git repository
4. Vercel will auto-detect Hugo settings

### 2. Configure Build Settings

Vercel should auto-detect Hugo, but verify these settings:

- **Framework Preset**: Hugo (or leave as "Other")
- **Build Command**: `hugo --gc --minify --cleanDestinationDir`
- **Output Directory**: `public`
- **Install Command**: Leave empty (Hugo doesn't need npm install)

### 3. Environment Variables (Optional)

If needed, add environment variables in:
**Project Settings** → **Environment Variables**

Common variables:
- `HUGO_ENV=production`
- `HUGO_ENABLEGITINFO=true`

### 4. Handle Git Submodules (Theme)

Since you're using the `hugo-profile` theme as a submodule:

**Option A: Auto-detect (Recommended)**
- Vercel should automatically handle submodules if your `.gitmodules` is configured correctly
- Make sure your theme submodule is committed properly

**Option B: Manual Configuration**
- In Vercel project settings, go to **Git**
- Enable **"Install Git Submodules"** option

### 5. Custom Domain Configuration

1. In Vercel dashboard → **Settings** → **Domains**
2. Click **"Add"** and enter your domain (`mahmoudouf.com`)
3. Follow DNS instructions:
   - Add a CNAME record pointing to `cname.vercel-dns.com`
   - Or add A records (IPs provided by Vercel)

### 6. Base URL Configuration

The `hugo.yaml` file has `baseURL: "https://mahmoudouf.com/"`. 

For Vercel preview deployments, you may want to:
- Use `VERCEL_URL` environment variable for previews
- Keep production baseURL as your custom domain

You can update `vercel.json` to handle this dynamically if needed.

## Build Configuration

The `vercel.json` file is configured with:

```json
{
  "buildCommand": "hugo --gc --minify --cleanDestinationDir",
  "outputDirectory": "public"
}
```

This will:
- Run Hugo with garbage collection (`--gc`)
- Minify output (`--minify`)
- Clean destination directory before build (`--cleanDestinationDir`)
- Output to `public/` directory

## Continuous Deployment

Once connected:
- Every push to `main`/`master` branch = automatic production deployment
- Every PR = preview deployment with unique URL
- Build logs available in real-time

## Advantages of Vercel

✅ **Fast global CDN** - Edge network for optimal performance
✅ **Automatic HTTPS** - Free SSL certificates
✅ **Preview deployments** - See PRs before merging
✅ **Zero-config deployments** - Auto-detects Hugo
✅ **Fast builds** - Optimized build environment
✅ **Analytics** - Built-in performance monitoring

## Troubleshooting

### Build Fails

1. Check **Deployments** tab in Vercel dashboard
2. Click on failed deploy to see build logs
3. Common issues:
   - **Hugo version**: Vercel auto-installs Hugo Extended, but you can specify version in environment variables
   - **Missing theme**: Ensure submodule is properly configured
   - **Base URL issues**: Check `hugo.yaml` baseURL setting

### Theme Not Found

If the theme submodule isn't loading:
1. Go to **Settings** → **Git**
2. Enable **"Install Git Submodules"**
3. Redeploy

### Base URL Issues

If links are broken in preview deployments:
- The baseURL in `hugo.yaml` is set to production domain
- Preview deployments will use that baseURL
- Consider using environment variables to set baseURL dynamically

## Manual Deployment

You can also deploy manually using Vercel CLI:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

## Current Configuration

- **Hugo Version**: Latest (auto-detected by Vercel)
- **Build Command**: `hugo --gc --minify --cleanDestinationDir`
- **Output Directory**: `public`
- **Base URL**: `https://mahmoudouf.com/` (from `hugo.yaml`)

