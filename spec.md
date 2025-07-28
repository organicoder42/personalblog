1. Project Overview

Name (placeholder): ai-dev-notes (change anytime)

Goal: A personal blog to document software development projects—both professional and personal—with a strong focus on creative, real‑world and experimental uses of AI tools.

Primary author: You (single‑author blog, but architected so multi-author support can be enabled later).

Core requirements (from you):

Built with Next.js and Tailwind CSS.

Supports text, images, and embedded videos (YouTube, Loom).

Easy authoring workflow (preferably Markdown/MDX in repo, or optional headless CMS later).

2. Tech Stack

Framework: Next.js 14+ (App Router).

Language: TypeScript.

Styling: Tailwind CSS + @tailwindcss/typography for prose.

Content: MDX files stored in /content/posts (Git-based). Use Contentlayer or next-mdx-remote plus custom MDX compiler. Contentlayer is preferred for type safety.

Markdown Enhancements: remark/rehype plugins (e.g., remark-gfm for tables, rehype-slug, rehype-autolink-headings).

Embeds: Custom React MDX components <YouTube />, <Loom />, <Tweet /> etc.

Images: Next.js next/image for optimization. Store locally (/public/images/...) or optionally integrate Cloudinary/UploadThing for hosted uploads.

Syntax Highlighting: Shiki or Rehype Pretty Code for code blocks.

Search: Local client-side fuzzy search (Fuse.js) or Algolia later. Start with local JSON index generated at build.

SEO & Metadata: next-seo or handcrafted metadata functions; Open Graph image generation via @vercel/og or satori.

Analytics: Plausible/Umami (privacy friendly) or Google Analytics (optional).

Comments (optional): Giscus/Utterances (GitHub Discussions) or disable entirely.

RSS/Atom & Sitemap: Generate with feed and next-sitemap packages.

Testing: Vitest/Jest for unit tests, Playwright for e2e.

CI/CD: GitHub Actions + Vercel Preview Deployments.

3. User Stories / Features

Authoring & Content

As the author, I can write posts in MDX with frontmatter (title, date, summary, tags, draft, cover image, hero video URL, etc.).

I can embed images in-line and use responsive captions.

I can embed YouTube & Loom videos with simple MDX components (<YouTube id="..." />).

I can add code snippets with syntax highlighting.

I can mark a post as draft: true so it’s excluded from production builds but still previewable.

Reader Experience

Readers can browse a reverse-chronological list of posts.

Readers can filter by tag/category and search across titles & summaries.

The site supports light/dark mode toggle.

Pages load fast (LCP < 2.5s on desktop/mobile) and work offline (optional PWA stretch goal).

Adaptive images, proper alt text for accessibility.

SEO-friendly URLs and meta tags.

Operations & Maintenance

Deployment to Vercel with automatic previews on every PR.

Easy to add new posts via git add content/posts/my-post.mdx.

RSS feed auto-updates when new posts are published.

OG images auto-generated per post (based on title/tagline).

4. Information Architecture & Routing

/ – Home: latest posts (paginated), intro/about snippet.

/posts – All posts (paginated list view).

/posts/[slug] – Individual post page.

/tags – List of tags.

/tags/[tag] – Posts filtered by a tag.

/about – Author bio, tooling list, contact links.

/uses (optional) – Hardware/software stack.

/rss.xml, /sitemap.xml – Generated feeds.

/api/og – Dynamic OG image endpoint.

5. Content Model (Frontmatter)

---
title: "Building an AI-powered XYZ"
slug: "ai-powered-xyz" # optional, fallback to file name
date: "2025-07-12"
updated: "2025-07-16" # optional
summary: "Short teaser shown on list pages"
tags: ["ai", "nextjs", "experiment"]
coverImage: "/images/xyz-cover.png" # or remote URL
heroVideo: "youtube:abc123" # or "loom:abcdef"
draft: false
---

6. Component Inventory

Layout

RootLayout (app layout, theme provider)

PostLayout (article wrapper, TOC, share links)

UI

Navbar, Footer, ThemeToggle, Tag, SearchInput

Pagination, BackToTopButton

MDX Components

YouTube, Loom, Image, Callout, Note, Warning

CodeBlock (if not using automatic shiki)

Utilities

generateRssFeed.ts, generateOgImage.tsx, getAllPosts.ts

7. Directory Structure

.
├─ app/
│  ├─ layout.tsx
│  ├─ page.tsx
│  ├─ posts/
│  │  ├─ page.tsx            # list view
│  │  └─ [slug]/page.tsx     # post detail
│  ├─ tags/
│  │  ├─ page.tsx
│  │  └─ [tag]/page.tsx
│  ├─ about/page.tsx
│  └─ api/og/route.ts        # OG image
├─ components/
│  ├─ mdx/
│  │  ├─ YouTube.tsx
│  │  ├─ Loom.tsx
│  │  └─ Image.tsx
│  ├─ ui/
│  │  ├─ Tag.tsx
│  │  ├─ ThemeToggle.tsx
│  │  └─ ...
├─ content/
│  └─ posts/*.mdx
├─ lib/
│  ├─ contentlayer.ts  # or mdx utils
│  ├─ rss.ts
│  └─ og.tsx
├─ public/
│  └─ images/
├─ styles/
│  └─ globals.css
├─ tests/
│  ├─ e2e/
│  └─ unit/
├─ scripts/
│  ├─ generate-rss.ts
│  └─ build-search-index.ts
├─ next.config.mjs
├─ tailwind.config.ts
├─ contentlayer.config.ts
├─ package.json
└─ tsconfig.json

8. SEO & Performance

Canonical URLs, meta description, structured data (JSON-LD for blog posts).

Preload hero images where needed.

Use next/font to self-host fonts.

Lazy-load embeds (YouTube/Loom) with intersection observer + placeholder thumbnail to avoid heavy iframes until visible.

Image sizes attribute and priority for LCP.

9. Accessibility

Semantic HTML (article, header, nav, main, footer).

ARIA labels for embeds and UI components.

Color contrast compliant with WCAG AA.

Alt text required in frontmatter for cover images; automatic fallback prompts during build.

10. Testing Strategy

Unit tests: Utilities (RSS generation, content parsing).

Component tests: MDX components render correctly with sample MDX.

E2E tests: Home page loads, post navigation works, search filters, dark mode toggle persists.

11. Deployment & Ops

Host on Vercel. Preview deployments from GitHub PRs.

vercel.json for headers/caching as needed.

GitHub Actions workflow: lint, type-check, test, build before merging.

12. Environment Variables (.env.example)

NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_GISCUS_REPO=owner/repo   # optional
PLAUSIBLE_DOMAIN=yourdomain.com       # optional
CLOUDINARY_URL=...                    # optional

13. Milestones & Acceptance Criteria

MVP (Week 1):

Next.js + Tailwind scaffold.

Basic layout, Home, Post page.

MDX content loading, code highlight.

Image & video embeds working.

v1 (Week 2-3):

Tags, search, RSS, sitemap.

Dark mode toggle.

OG image generation.

CI/CD pipeline.

v1.1+:

Comments, Analytics, PWA, Draft previews, Cloud image upload, Algolia.

Done means:

Lighthouse: Performance > 90, Accessibility > 95.

All features in MVP & v1 are implemented & documented.

README updated with how to add a post.

