# Deployment Guide

This guide covers deploying the AI Development Notes blog to various platforms.

## 🚀 Vercel (Recommended)

Vercel provides the best experience for Next.js applications with automatic deployments, preview URLs, and edge optimization.

### Prerequisites
- GitHub account
- Vercel account (free tier available)
- Repository pushed to GitHub

### Step-by-Step Deployment

1. **Prepare Your Repository**
   ```bash
   # Ensure all files are committed
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up/login with GitHub
   - Click "New Project"
   - Import your repository

3. **Configure Build Settings**
   Vercel will auto-detect Next.js settings:
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)
   - **Install Command**: `npm install --legacy-peer-deps`

4. **Environment Variables**
   Add these in the Vercel dashboard:
   ```env
   NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for build completion (~2-3 minutes)
   - Get your live URL: `https://your-project.vercel.app`

### Custom Domain Setup

1. **Add Domain in Vercel**
   - Go to Project Settings → Domains
   - Add your custom domain
   - Follow DNS configuration instructions

2. **Update Environment Variables**
   ```env
   NEXT_PUBLIC_SITE_URL=https://yourdomain.com
   ```

3. **Redeploy**
   - Push any change to trigger rebuild with new URL

### Automatic Deployments

Every push to `main` branch triggers:
- ✅ Production deployment
- ✅ Automatic SSL certificate
- ✅ Global CDN distribution
- ✅ Cache optimization

Pull requests get:
- 🔍 Preview deployments
- 🧪 Automatic testing
- 💬 Deployment comments

## 🐙 GitHub Pages

For static hosting without server-side features.

### Setup

1. **Install GitHub Pages Adapter**
   ```bash
   npm install -D @next/bundle-analyzer
   ```

2. **Update next.config.ts**
   ```typescript
   const nextConfig = {
     output: 'export',
     trailingSlash: true,
     images: {
       unoptimized: true
     }
   }
   ```

3. **Create GitHub Action**
   ```yaml
   # .github/workflows/deploy.yml
   name: Deploy to GitHub Pages
   on:
     push:
       branches: [ main ]
   
   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - uses: actions/setup-node@v3
           with:
             node-version: '18'
         - run: npm ci --legacy-peer-deps
         - run: npm run build
         - uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./out
   ```

### Limitations
- ❌ No server-side functions (OG images won't work)
- ❌ No API routes
- ❌ Static export only

## 🌊 Netlify

Alternative platform with similar features to Vercel.

### Deployment Steps

1. **Connect Repository**
   - Go to [netlify.com](https://netlify.com)
   - "New site from Git"
   - Connect GitHub repository

2. **Build Settings**
   ```
   Build command: npm run build
   Publish directory: .next
   Node version: 18
   ```

3. **Environment Variables**
   ```env
   NEXT_PUBLIC_SITE_URL=https://your-site.netlify.app
   NPM_FLAGS=--legacy-peer-deps
   ```

4. **Deploy**
   - Click "Deploy site"
   - Get your URL: `https://random-name.netlify.app`

### Custom Domain
- Go to Domain settings
- Add custom domain
- Configure DNS records

## 🐳 Docker Deployment

For containerized deployment to any platform.

### Dockerfile

```dockerfile
FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps --only=production

FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

### Docker Compose

```yaml
version: '3.8'
services:
  ai-dev-notes:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_SITE_URL=https://yourdomain.com
    restart: unless-stopped
```

### Build & Run

```bash
# Build image
docker build -t ai-dev-notes .

# Run container
docker run -p 3000:3000 -e NEXT_PUBLIC_SITE_URL=https://yourdomain.com ai-dev-notes
```

## ☁️ Cloud Platforms

### AWS Amplify

1. **Connect Repository**
   - AWS Console → Amplify
   - Connect GitHub repository

2. **Build Settings**
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm ci --legacy-peer-deps
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: .next
       files:
         - '**/*'
   ```

### Google Cloud Run

```bash
# Build and deploy
gcloud run deploy ai-dev-notes \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### Azure Static Web Apps

```yaml
# .github/workflows/azure-static-web-apps.yml
name: Azure Static Web Apps CI/CD
on:
  push:
    branches: [ main ]

jobs:
  build_and_deploy_job:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          action: "upload"
          app_location: "/"
          output_location: ".next"
```

## 🔧 Build Optimization

### Production Checklist

- [ ] **Environment Variables**: Set production URLs
- [ ] **Analytics**: Configure tracking (optional)
- [ ] **Error Monitoring**: Set up Sentry (optional)
- [ ] **Performance**: Run Lighthouse audit
- [ ] **SEO**: Verify meta tags and sitemap
- [ ] **Security**: Check for exposed secrets
- [ ] **Testing**: Run full test suite

### Performance Tips

1. **Image Optimization**
   - Use WebP format when possible
   - Compress images before adding to `/public`
   - Use appropriate dimensions

2. **Bundle Analysis**
   ```bash
   # Analyze bundle size
   npm run build
   npx @next/bundle-analyzer
   ```

3. **Caching Strategy**
   - Static assets: 1 year cache
   - API routes: 1 hour cache
   - Pages: CDN cache with revalidation

### Monitoring

**Vercel Analytics**: Automatic with Vercel deployment
**Google Analytics**: Add GA_ID to environment variables
**Web Vitals**: Built into Next.js
**Error Tracking**: Add Sentry DSN to environment

## 🚨 Troubleshooting

### Common Issues

**Build Fails - Dependency Errors**
```bash
# Solution: Use legacy peer deps
npm install --legacy-peer-deps
```

**OG Images Not Working**
- Ensure Vercel functions are enabled
- Check function timeout limits
- Verify image generation API route

**Search Not Working**
- Verify `search-index.json` is generated
- Check build script includes generation
- Ensure Fuse.js is properly installed

**Styles Not Loading**
- Verify Tailwind CSS configuration
- Check import order in globals.css
- Ensure PostCSS configuration is correct

### Getting Help

1. **Check build logs** in your deployment platform
2. **Review error messages** for specific issues
3. **Test locally** before deploying
4. **Open an issue** on GitHub for support

---

**Ready to deploy?** Choose your platform and follow the guide above! 🚀