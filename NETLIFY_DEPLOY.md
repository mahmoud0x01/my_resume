# Deploy to Netlify

Netlify is often easier and more reliable than GitHub Pages for Hugo sites.

## Quick Setup Steps

### 1. Create Netlify Account
- Go to [netlify.com](https://www.netlify.com)
- Sign up with GitHub (easiest way)

### 2. Deploy from GitHub
1. In Netlify dashboard, click **"Add new site"** → **"Import an existing project"**
2. Choose **GitHub** and authorize Netlify
3. Select your repository
4. Netlify will auto-detect Hugo settings from `netlify.toml`

### 3. Build Settings (Auto-detected)
- **Build command**: `hugo --gc --minify`
- **Publish directory**: `public`
- **Hugo version**: `0.129.0` (or latest)

### 4. Custom Domain (Optional)
1. In Netlify dashboard → **Site settings** → **Domain management**
2. Click **"Add custom domain"**
3. Enter `mahmoudouf.com`
4. Follow DNS instructions:
   - Add CNAME record: `mahmoudouf.com` → `your-site.netlify.app`
   - Or add A records (IPs provided by Netlify)

### 5. Environment Variables (if needed)
If you need any environment variables, add them in:
**Site settings** → **Environment variables**

## Advantages of Netlify

✅ **No cache issues** - Fresh builds every time
✅ **Instant deployments** - Usually deploys in 1-2 minutes
✅ **Preview deployments** - See PRs before merging
✅ **Better CDN** - Faster global delivery
✅ **Automatic HTTPS** - Free SSL certificates
✅ **Form handling** - Built-in form processing
✅ **Better logs** - Easier to debug build issues

## Continuous Deployment

Once connected:
- Every push to `master` branch = automatic deployment
- Every PR = preview deployment
- Build logs available in real-time

## Troubleshooting

If build fails:
1. Check **Deploys** tab in Netlify dashboard
2. Click on failed deploy to see logs
3. Common issues:
   - Hugo version mismatch (check `netlify.toml`)
   - Missing theme (ensure theme is committed or use submodule)

## Current Configuration

The `netlify.toml` file is configured with:
- Hugo 0.129.0
- Production environment
- Minified output
- Garbage collection enabled

## Next Steps

1. Push your code to GitHub (if not already)
2. Connect repository to Netlify
3. Deploy!
4. Update DNS if using custom domain

That's it! Netlify will handle everything automatically.

