This document tells Claude Code how to implement the project from spec.md. It includes task breakdowns, guardrails, and output formats.

1. Meta Instructions for Claude Code

Act as a senior full-stack engineer implementing the provided spec in Next.js 14 with Tailwind.

Never hallucinate requirements; if something is unclear, ask for clarification before coding.

Work in discrete, reviewable steps: propose a plan → get confirmation → write code → explain changes.

Output diffs or full files as requested; prefer diffs (git diff --patch) when modifying existing files.

Assume a fresh repo unless told otherwise.

Use TypeScript everywhere.

Use App Router, not Pages Router.

Required Response Format (general step)

What you’ll do next (bullet list)

Commands to run (if any)

Files to create/edit (tree view)

Code blocks with complete file contents or diffs

Post-step verification: how we can test locally

Questions/Assumptions (if needed)

2. Setup Phase (Step 0)

Goal: Scaffold project

Claude should:

Run: npx create-next-app@latest ai-dev-notes --ts --eslint --app --tailwind --src-dir --import-alias "@/*"

Confirm versions of Next.js and Tailwind.

Add dependencies: contentlayer next-contentlayer remark-gfm rehype-slug rehype-autolink-headings rehype-pretty-code shiki fuse.js next-seo feed next-sitemap (trim if any change).

Configure contentlayer.config.ts.

Set up Tailwind plugins (@tailwindcss/typography).

3. Content Layer & MDX (Step 1)

Claude tasks:

Implement contentlayer.config.ts to parse MDX in /content/posts with frontmatter schema from spec.

Add MDX components mapping (YouTube, Loom).

Create sample post in /content/posts/hello-ai.mdx.

Add utility functions in lib/contentlayer.ts (e.g., allPosts sorted by date, getPostBySlug).

4. Layout & Pages (Step 2)

Create app/layout.tsx with HTML metadata, font, theme provider.

app/page.tsx – list latest posts, paginate (static or simple top-N for MVP).

app/posts/page.tsx – full list, search input.

app/posts/[slug]/page.tsx – render MDX.

app/tags/[tag]/page.tsx & app/tags/page.tsx.

app/about/page.tsx.

5. UI & Styling (Step 3)

Add base components: Navbar, Footer, ThemeToggle (using next-themes), Tag chips, Pagination.

Configure Tailwind prose styles for MDX content.

6. Embeds & Media (Step 4)

Implement <YouTube id="..." title?="..." /> using a lightweight wrapper (thumbnail → iframe on click or IntersectionObserver).

Implement <Loom id="..." /> similarly.

Custom <Image> MDX component using next/image with captions.

7. Enhancements (Step 5)

Search: build script to generate search-index.json at build time (title, summary, tags). Client loads and uses Fuse.js.

RSS & Sitemap: scripts in scripts/, run at build.

OG Images: route in /app/api/og/route.ts using @vercel/og.

SEO: shared metadata.ts helper or next-seo config.

8. Testing (Step 6)

Add Vitest/Jest config for unit tests.

Playwright for e2e: sample tests for navigation, dark mode.

GitHub Action workflow .github/workflows/ci.yml to run lint, type-check, test.

9. Deployment (Step 7)

Vercel deployment instructions, env var setup.

Provide README.md with instructions for adding posts, running locally, deploying.

10. Stretch Tasks (Optional)

Comments with Giscus.

Analytics with Plausible.

PWA support.

Algolia search integration.

11. Prompts & Checklists for Each Step

Example Prompt: Step 1 (Contentlayer)

Task: Set up Contentlayer for MDX posts.Do:

Add deps  2. contentlayer.config.ts  3. lib/contentlayer.ts  4. Sample MDX file  5. Update next.config.mjs to enable contentlayer plugin.Output: file tree + full file contents.Verify: run pnpm dlx contentlayer build and pnpm dev successfully renders sample post.

Example Prompt: Step 4 (Embeds)

Implement <YouTube /> and <Loom /> MDX components with lazy-loaded iframes. Provide TSX files and usage example in MDX. Include accessibility (title, aria-label). Show how to pass just id or full URL.

Code Diff Format (preferred)

--- a/app/page.tsx
+++ b/app/page.tsx
@@
- return <div>TODO</div>
+ return (
+  <main className="prose dark:prose-invert">
+    {/* content */}
+  </main>
+ )

12. Quality Gates for Claude

Ensure all TypeScript types are correct, no any unless justified.

Run pnpm lint && pnpm typecheck && pnpm test before concluding a step.

Lighthouse targets: Perf > 90, A11y > 95 (manual check instructions).

Ask before adding heavy deps.

13. Open Questions Claude Should Raise (If Not Provided)

Preferred analytics provider? (default Plausible)

Do we want comments? If yes, which service?

Custom domain & path structure? (e.g., /blog/ prefix?)

Do we want multi-author support now?

Any branding assets (logo, colors, fonts) or just Tailwind defaults?

14. Final Delivery Checklist

Repo builds cleanly on fresh clone.

README.md explains setup, writing posts, deploying.

Example MDX post demonstrates embeds.

RSS works (validate with feed validator).

OG image endpoint returns an image for sample post.

Search works locally.

End of prompt_plan.md