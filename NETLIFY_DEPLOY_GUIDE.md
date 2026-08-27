# Deploy to Netlify - Step by Step Guide

Your site is already configured for Netlify! Here's how to deploy:

## Method 1: Deploy via GitHub (Recommended - Automatic)

### Step 1: Push Your Code to GitHub
```bash
# Make sure all changes are committed
git add .
git commit -m "Update skills section and add language proficiency"
git push origin master
```

### Step 2: Connect to Netlify
1. Go to [netlify.com](https://www.netlify.com) and sign in (or sign up with GitHub)
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose **GitHub** and authorize Netlify to access your repositories
4. Select your repository: `mahmoud0x01/portfolio-infosec`
5. Netlify will auto-detect settings from `netlify.toml`:
   - **Build command**: `hugo --gc --minify --cleanDestinationDir --baseURL https://mahmoudouf.com/`
   - **Publish directory**: `public`
   - **Hugo version**: Latest (auto-detected)

### Step 3: Configure Custom Domain
1. In Netlify dashboard → Your site → **Site settings** → **Domain management**
2. Click **"Add custom domain"**
3. Enter `mahmoudouf.com`
4. Netlify will provide DNS instructions:
   - **Option A (Recommended)**: Add CNAME record
     - Type: `CNAME`
     - Name: `@` or `mahmoudouf.com`
     - Value: `your-site-name.netlify.app`
   - **Option B**: Add A records (IPs provided by Netlify)
5. Wait for DNS propagation (usually 5-30 minutes)
6. Netlify will automatically provision SSL certificate

### Step 4: Verify Deployment
- Your site will be live at `https://mahmoudouf.com` once DNS propagates
- You'll also get a Netlify URL: `https://your-site-name.netlify.app`

## Method 2: Deploy via Netlify CLI (Manual)

### Step 1: Install Netlify CLI
```bash
npm install -g netlify-cli
```

### Step 2: Login to Netlify
```bash
netlify login
```

### Step 3: Initialize Site
```bash
cd /home/mahmoud/portfolio-dev
netlify init
```

### Step 4: Deploy
```bash
# Build and deploy
netlify deploy --prod

# Or just build locally and deploy
hugo --gc --minify --cleanDestinationDir
netlify deploy --prod --dir=public
```

## Method 3: Drag & Drop (Quick Test)

1. Build your site locally:
   ```bash
   hugo --gc --minify --cleanDestinationDir
   ```
2. Go to [app.netlify.com/drop](https://app.netlify.com/drop)
3. Drag the `public` folder to the drop zone
4. Your site will be live in seconds!

## Continuous Deployment (Automatic)

Once connected via GitHub:
- ✅ Every push to `master` = automatic production deployment
- ✅ Every Pull Request = preview deployment (test before merging)
- ✅ Build logs available in real-time
- ✅ Rollback to previous deployments with one click

## Current Configuration

Your `netlify.toml` is configured with:
- ✅ Production baseURL: `https://mahmoudouf.com/`
- ✅ Preview deployments use dynamic URLs
- ✅ Hugo latest version
- ✅ Minified output
- ✅ Garbage collection enabled
- ✅ Clean destination directory

## Troubleshooting

### Build Fails
1. Check **Deploys** tab in Netlify dashboard
2. Click on failed deploy to see detailed logs
3. Common issues:
   - **Theme not found**: Ensure `themes/hugo-profile` is committed or use Git submodule
   - **Hugo version**: Netlify auto-detects, but you can specify in `netlify.toml`
   - **Missing files**: Check that all required files are committed

### DNS Issues
- DNS propagation can take up to 48 hours (usually 5-30 minutes)
- Use `dig mahmoudouf.com` or online DNS checker to verify
- Make sure CNAME/A records are correct

### Cache Issues
- Netlify doesn't have the same cache issues as GitHub Pages
- If you see old content, try:
  1. Clear browser cache (Ctrl+Shift+R / Cmd+Shift+R)
  2. Trigger a new deploy in Netlify dashboard
  3. Check if you're viewing the correct site URL

## Advantages of Netlify over GitHub Pages

✅ **No cache issues** - Fresh builds every time  
✅ **Faster deployments** - Usually 1-2 minutes  
✅ **Preview deployments** - Test PRs before merging  
✅ **Better CDN** - Faster global delivery  
✅ **Automatic HTTPS** - Free SSL certificates  
✅ **Better logs** - Easier debugging  
✅ **Form handling** - Built-in form processing  
✅ **Split testing** - A/B testing capabilities  
✅ **Rollback** - One-click rollback to previous versions  

## Next Steps

1. ✅ Push your code to GitHub (if not already done)
2. ✅ Connect repository to Netlify
3. ✅ Configure custom domain
4. ✅ Wait for DNS propagation
5. ✅ Enjoy your live site!

Your site will automatically redeploy on every push to the master branch.

