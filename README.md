# Personal Blog

A modern, fast, and SEO-optimized personal blog built with Next.js and TypeScript.

## Features

- 🚀 Built with Next.js 15 and React 19
- 📝 MDX support for rich content authoring
- 🎨 Dark/Light theme with next-themes
- 🔍 Full-text search with Fuse.js
- 📱 Fully responsive design
- 🏷️ Tag-based content organization
- 📊 SEO optimized with structured data
- 🔄 RSS feed generation
- 🗺️ Automatic sitemap generation
- ⚡ Lightning-fast performance
- 🧪 Comprehensive testing with Vitest and Playwright
- 📈 Performance monitoring with Lighthouse CI

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Content**: Contentlayer for MDX processing
- **Testing**: Vitest (unit) + Playwright (e2e)
- **Deployment**: Vercel-ready configuration

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run all tests
- `npm run test:unit` - Run unit tests
- `npm run test:e2e` - Run end-to-end tests
- `npm run generate:all` - Generate search index, RSS, and sitemap

## Content Management

Add your blog posts as MDX files in the `ai-dev-notes/content/posts/` directory. Each post should include frontmatter with:

```yaml
---
title: "Your Post Title"
date: "2024-01-01"
tags: ["tag1", "tag2"]
---
```

## Deployment

This project is optimized for deployment on Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically with each push

## License

MIT License - feel free to use this project as a template for your own blog.

## Author

Built by [organicoder42](https://github.com/organicoder42)