# Cloudflare Pages Deployment Guide

This guide will help you deploy the Elivate frontend to Cloudflare Pages.

## Prerequisites

1. **Cloudflare Account**: Sign up at [cloudflare.com](https://cloudflare.com)
2. **GitHub Repository**: Your code should be pushed to GitHub
3. **Supabase Project**: Have your Supabase URL and Anon Key ready

## Deployment Steps

### 1. Connect Your Repository

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **Pages** in the sidebar
3. Click **Create a project**
4. Click **Connect to Git**
5. Select **GitHub** and authorize Cloudflare
6. Select your repository: `Bipul04/Elivate-frontend`
7. Choose the branch to deploy (usually `main`)

### 2. Configure Build Settings

Set the following build configuration:

```
Framework preset: Next.js
Build command: npm run build
Build output directory: .next
Root directory: frontend
```

### 3. Environment Variables

Add these environment variables in Cloudflare Pages settings:

**Required Variables:**
```
NODE_VERSION = 18
NEXT_PUBLIC_SUPABASE_URL = your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY = your_supabase_anon_key
NEXT_TELEMETRY_DISABLED = 1
```

**Optional Variables:**
```
NEXT_PUBLIC_SITE_URL = https://your-domain.pages.dev
```

#### How to Add Environment Variables:

1. In your Cloudflare Pages project settings
2. Go to **Settings** > **Environment variables**
3. Add each variable for both **Production** and **Preview** environments
4. Click **Save**

### 4. Deploy

1. Click **Save and Deploy**
2. Cloudflare will start building your project
3. Wait for the build to complete (usually 2-5 minutes)
4. Your site will be available at `https://your-project-name.pages.dev`

## Build Configuration Files

The following files have been created for Cloudflare Pages:

- `wrangler.toml` - Cloudflare configuration
- `.cfpages.toml` - Cloudflare Pages specific configuration
- `build-cloudflare.sh` - Custom build script (optional)
- `next.config.js` - Updated with Cloudflare optimizations

## Custom Domain Setup

### Using Cloudflare DNS:

1. Go to your Cloudflare Pages project
2. Navigate to **Custom domains**
3. Click **Set up a custom domain**
4. Enter your domain name (e.g., `elivate.com` or `www.elivate.com`)
5. Cloudflare will automatically configure DNS if your domain is on Cloudflare
6. Wait for DNS propagation (usually instant with Cloudflare)

### Using External DNS:

Add a CNAME record:
```
CNAME  www  your-project-name.pages.dev
```

## Updating Supabase Configuration

After deployment, update your Supabase project settings:

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Authentication** > **URL Configuration**
4. Add your Cloudflare Pages URLs to:
   - **Site URL**: `https://your-project-name.pages.dev`
   - **Redirect URLs**: 
     ```
     https://your-project-name.pages.dev/**
     https://your-custom-domain.com/**
     ```

## Automatic Deployments

Cloudflare Pages automatically deploys:
- **Production**: When you push to `main` branch
- **Preview**: When you create a Pull Request

## Build Optimization Tips

### 1. Reduce Build Time
- Dependencies are cached automatically
- Use `npm ci` instead of `npm install`
- Enable incremental builds

### 2. Performance Optimization
- Images are automatically optimized by Cloudflare
- Enable Cloudflare CDN for static assets
- Use Cloudflare's automatic minification

### 3. Environment-Specific Builds
```javascript
// In your code, detect environment:
const isProduction = process.env.NODE_ENV === 'production'
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
```

## Troubleshooting

### Build Fails

**Error: Module not found**
- Solution: Check `package.json` dependencies
- Run: `npm install` locally and push updated `package-lock.json`

**Error: Out of memory**
- Solution: Reduce build complexity
- Remove unused dependencies
- Split large components

**Error: Environment variables not found**
- Solution: Double-check environment variables in Cloudflare Pages settings
- Ensure they're set for the correct environment (Production/Preview)

### Runtime Errors

**Error: API calls failing**
- Check Supabase URL and API keys
- Verify CORS settings in Supabase
- Check browser console for specific errors

**Error: Images not loading**
- Verify image paths are correct
- Check image formats are supported
- Ensure images are in `public/` directory

### Deployment Issues

**Site not updating**
- Clear Cloudflare cache
- Trigger manual redeployment
- Check if build completed successfully

**Custom domain not working**
- Verify DNS records
- Wait for DNS propagation (up to 24 hours)
- Check SSL/TLS settings

## Monitoring & Analytics

### Cloudflare Web Analytics

1. Go to **Web Analytics** in Cloudflare dashboard
2. Add your Pages site
3. View real-time traffic and performance metrics

### Performance Monitoring

- Check Core Web Vitals in Cloudflare dashboard
- Monitor build times
- Review deployment logs

## CI/CD Integration

Cloudflare Pages automatically handles CI/CD:

```yaml
# Automatic deployment flow:
1. Push code to GitHub
2. Cloudflare detects changes
3. Runs build command
4. Deploys to edge network
5. Site is live globally
```

## Rollback

To rollback to a previous deployment:

1. Go to **Deployments** in Cloudflare Pages
2. Find the working deployment
3. Click **...** (three dots)
4. Select **Rollback to this deployment**

## Security Best Practices

1. **Never commit sensitive data**
   - Use environment variables for API keys
   - Add sensitive files to `.gitignore`

2. **Enable Branch Protection**
   - Require PR reviews before merging
   - Enable status checks

3. **Secure Headers**
   - Cloudflare automatically adds security headers
   - Configure additional headers in `_headers` file if needed

## Support & Resources

- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages)
- [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- [Supabase Documentation](https://supabase.com/docs)

## Quick Commands

```bash
# Test build locally
npm run build

# Type check
npm run typecheck

# Run development server
npm run dev

# Run custom Cloudflare build script
./build-cloudflare.sh
```

---

## Summary

✅ Configuration files created and optimized for Cloudflare Pages
✅ Build scripts configured
✅ Environment variable setup documented
✅ Custom domain instructions provided
✅ Troubleshooting guide included

Your frontend is now ready to deploy to Cloudflare Pages! 🚀
