# Fix Old Content on GitHub Pages

If you're seeing old content (including old "About Me" text) on your live site, follow these steps:

## Step 1: Verify Your Local Content is Correct

Check that `hugo.yaml` has the updated content:
- About Me should say "Experienced Penetration Tester" (not "Aspiring")
- Only 3 blog posts should exist
- No gallery section

## Step 2: Commit All Changes

```bash
git add .
git commit -m "Update content and fix deployment"
git push origin master
```

## Step 3: Force Complete Rebuild

1. Go to your GitHub repository
2. Click **Actions** tab
3. Find the latest workflow run
4. Click **Re-run jobs** → **Re-run all jobs**

## Step 4: Clear GitHub Pages Cache

1. Go to **Settings** → **Pages**
2. Under **Custom domain**, remove the domain temporarily
3. Save
4. Wait 30 seconds
5. Add the domain back
6. Save again

This forces GitHub to completely rebuild the site.

## Step 5: Clear Browser Cache

- Hard refresh: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
- Or use incognito/private browsing mode

## Step 6: Check Deployment

After the workflow completes:
1. Wait 2-3 minutes for DNS/CDN propagation
2. Check your site in incognito mode
3. Verify the About Me section shows the new content

## If Still Not Working

The workflow now includes:
- Complete cleanup of `public/` directory
- Cleanup of `resources/_gen/` cache
- `--cleanDestinationDir` flag for Hugo
- Fresh build on every deployment

If old content persists, it might be:
- Browser cache (try different browser/incognito)
- CDN cache (wait 5-10 minutes)
- GitHub Pages cache (follow Step 4 above)

