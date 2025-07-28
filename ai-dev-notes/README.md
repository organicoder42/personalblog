# AI Development Notes

A modern, performant blog built with Next.js 14, TypeScript, and Tailwind CSS, featuring MDX content management, search functionality, and comprehensive testing.

![AI Development Notes](https://img.shields.io/badge/Next.js-14-black?logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel&logoColor=white)

## ✨ Features

### 🚀 Performance & SEO
- **Static Site Generation (SSG)** with incremental regeneration
- **Optimized images** with Next.js Image component
- **Dynamic OG image generation** for social sharing
- **Comprehensive SEO** with structured metadata
- **RSS/Atom feeds** for content syndication
- **XML sitemap** and robots.txt for search engines

### 📝 Content Management
- **MDX support** with rich content capabilities
- **Frontmatter-based** post metadata
- **Draft support** for work-in-progress posts
- **Tag-based categorization** with dedicated tag pages
- **Automatic post sorting** by publication date

### 🎨 User Experience
- **Responsive design** that works on all devices
- **Dark/light mode** with system preference detection
- **Real-time search** with fuzzy matching (Fuse.js)
- **Lazy-loaded video embeds** (YouTube & Loom)
- **Mobile-first navigation** with hamburger menu

### 🧪 Quality Assurance
- **Unit testing** with Vitest and React Testing Library
- **E2E testing** with Playwright across multiple browsers
- **Type safety** with TypeScript
- **Linting** with ESLint and Prettier
- **CI/CD pipeline** with GitHub Actions

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.0 or later
- **npm** or **yarn** package manager
- **Git** for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-dev-notes
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:3000
   ```

## 📚 Project Structure

```
ai-dev-notes/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── api/og/         # Dynamic OG image generation
│   │   ├── posts/          # Blog post pages
│   │   ├── tags/           # Tag-based filtering
│   │   └── layout.tsx      # Root layout with metadata
│   ├── components/         # Reusable React components
│   │   ├── __tests__/      # Component unit tests
│   │   ├── navbar.tsx      # Navigation with search
│   │   ├── search.tsx      # Search functionality
│   │   └── mdx-components.tsx # MDX component mapping
│   └── lib/                # Utility functions
├── content/posts/          # MDX blog posts
├── public/                 # Static assets
├── e2e/                    # Playwright E2E tests
├── scripts/                # Build and generation scripts
└── .github/workflows/      # CI/CD pipeline
```

## ✍️ Writing Posts

### Creating a New Post

1. **Create a new MDX file** in `content/posts/`:
   ```bash
   touch content/posts/my-new-post.mdx
   ```

2. **Add frontmatter** at the top:
   ```mdx
   ---
   title: "Your Post Title"
   publishedAt: "2025-01-25"
   summary: "A brief description of your post"
   image: "/images/your-image.jpg"  # Optional
   tags: ["ai", "development", "tutorial"]
   draft: false  # Set to true for drafts
   ---

   # Your Post Content

   Write your content here using **Markdown** and MDX components.
   ```

3. **Use available components**:
   ```mdx
   # YouTube Videos
   <YouTube id="dQw4w9WgXcQ" title="Video Title" />

   # Loom Videos  
   <Loom id="your-loom-id" title="Demo Video" />

   # Images with captions
   ![Alt text](/images/screenshot.png "Optional caption")
   ```

### Frontmatter Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | ✅ | Post title for SEO and display |
| `publishedAt` | string | ✅ | Publication date (YYYY-MM-DD) |
| `summary` | string | ✅ | Brief description for SEO and previews |
| `image` | string | ❌ | Hero image path |
| `tags` | array | ❌ | Categorization tags |
| `draft` | boolean | ❌ | Hide from production (default: false) |

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run start           # Start production server
npm run lint            # Run ESLint

# Testing
npm run test            # Run all tests
npm run test:unit       # Run unit tests only
npm run test:e2e        # Run E2E tests
npm run test:unit:watch # Watch mode for unit tests

# Content Generation
npm run generate:search   # Generate search index
npm run generate:rss     # Generate RSS feeds
npm run generate:sitemap # Generate XML sitemap
npm run generate:all     # Generate all static files
```

### Environment Variables

Create a `.env.local` file for local development:

```env
# Optional: Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Optional: Error monitoring
SENTRY_DSN=https://xxx@sentry.io/xxx

# Production URL (for sitemap generation)
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure build settings (auto-detected)

3. **Configure Environment Variables** in Vercel dashboard:
   - `NEXT_PUBLIC_SITE_URL`: Your production URL
   - Add any analytics or monitoring variables

4. **Deploy**
   - Vercel will automatically deploy on every push to main
   - Preview deployments for pull requests

### Manual Deployment

```bash
# Build the application
npm run build

# The built files are in `.next/` directory
# Deploy to your preferred hosting platform
```

### Build Configuration

The build process automatically:
- ✅ Generates search index for client-side search
- ✅ Creates RSS/Atom feeds 
- ✅ Builds XML sitemap with all pages
- ✅ Optimizes images and assets
- ✅ Generates static pages for posts and tags

## 🧪 Testing

### Unit Tests
```bash
npm run test:unit
```
Tests components and utility functions with Vitest and React Testing Library.

### End-to-End Tests
```bash
npm run test:e2e
```
Tests user journeys across multiple browsers with Playwright:
- Navigation functionality
- Dark mode toggle
- Search functionality
- Mobile responsiveness

### Test Coverage
Key areas covered:
- ✅ Component rendering and interactions
- ✅ Content management utilities
- ✅ Search functionality
- ✅ Theme switching
- ✅ Mobile navigation
- ✅ Post creation and display

## 🔧 Customization

### Styling
- **Colors**: Modify `src/app/globals.css` for theme colors
- **Typography**: Update font imports in `src/app/layout.tsx`
- **Components**: Customize components in `src/components/`

### Content
- **Site metadata**: Update `src/app/layout.tsx`
- **Navigation**: Modify `src/components/navbar.tsx`
- **Footer**: Edit `src/components/footer.tsx`
- **About page**: Update `src/app/about/page.tsx`

### Features
- **Search**: Configure Fuse.js options in `src/components/search.tsx`
- **Video embeds**: Extend `src/components/mdx-components.tsx`
- **SEO**: Enhance metadata in page components

## 📊 Performance

### Lighthouse Scores (Target)
- **Performance**: > 90
- **Accessibility**: > 95  
- **Best Practices**: > 90
- **SEO**: > 90

### Optimizations
- ✅ Static generation for all pages
- ✅ Image optimization with Next.js Image
- ✅ Code splitting and lazy loading
- ✅ Minimal JavaScript bundle
- ✅ CDN deployment with Vercel

## 🤝 Contributing

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Create Pull Request**

### Development Guidelines
- ✅ Write tests for new features
- ✅ Follow TypeScript strict mode
- ✅ Use semantic commit messages
- ✅ Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js** - The React framework for production
- **Contentlayer** - Content management for developers  
- **Tailwind CSS** - Utility-first CSS framework
- **Vercel** - Deployment and hosting platform
- **Fuse.js** - Lightweight fuzzy-search library

---

**Built with ❤️ for the AI development community**

For questions or support, please [open an issue](../../issues) on GitHub.