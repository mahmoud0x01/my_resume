# Deploy to Vercel

This guide explains how to deploy your Hugo portfolio site to Vercel.

## Prerequisites

1. A Vercel account ([vercel.com](https://vercel.com))
2. Your repository pushed to GitHub, GitLab, or Bitbucket

## Quick Setup Steps

### 1. Import Project to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New..."** → **"Project"**
3. Import your Git repository

### 2. Configure Build Settings

The project includes a `build.sh` script that automatically installs Hugo Extended and builds the site. Verify these settings in Vercel:

- **Framework Preset**: Other (or leave as default)
- **Build Command**: `./build.sh` (automatically set via `vercel.json`)
- **Output Directory**: `public` (automatically set via `vercel.json`)
- **Install Command**: Leave empty

**Note**: The `build.sh` script will:
- Download and install the latest Hugo Extended version
- Clean build artifacts
- Build the site with minification and garbage collection

### 3. Environment Variables (Optional)

If needed, add environment variables in:
**Project Settings** → **Environment Variables**

Common variables:
- `HUGO_ENV=production`
- `HUGO_ENABLEGITINFO=true`

### 4. Handle Git Submodules (Theme)

Since you're using the `hugo-profile` theme as a submodule:

**Important**: The `build.sh` script now automatically initializes submodules, but you should also:

1. In Vercel project settings, go to **Settings** → **Git**
2. Enable **"Install Git Submodules"** option
3. This ensures submodules are available during the build process

**Note**: If icons or layout appear in the wrong place on Vercel but work locally, it's likely a submodule initialization issue. The build script will handle this automatically, but make sure the submodule is properly committed in your repository.

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
  "buildCommand": "./build.sh",
  "outputDirectory": "public"
}
```

The `build.sh` script will:
- Download and install the latest Hugo Extended version
- Clean previous build artifacts (`public/`, `resources/_gen/`, `.hugo_build.lock`)
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
   - **Hugo not found**: The `build.sh` script should install Hugo automatically. If it fails, check the build logs for download errors
   - **Missing theme**: Ensure submodule is properly configured and "Install Git Submodules" is enabled
   - **Base URL issues**: Check `hugo.yaml` baseURL setting
   - **Permission errors**: The `build.sh` script should be executable (chmod +x). If committed to git, it should preserve permissions

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

- **Hugo Version**: Latest (automatically downloaded by `build.sh`)
- **Build Command**: `./build.sh` (installs Hugo and builds)
- **Output Directory**: `public`
- **Base URL**: `https://mahmoudouf.com/` (from `hugo.yaml`)

