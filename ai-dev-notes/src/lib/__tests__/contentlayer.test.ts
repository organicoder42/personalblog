import { describe, it, expect, vi, beforeAll } from 'vitest'

const mockPosts = [
  {
    title: 'Test Post 1',
    summary: 'First test post',
    publishedAt: '2025-01-15',
    slug: 'test-post-1',
    url: '/posts/test-post-1',
    tags: ['test', 'first'],
    draft: false,
  },
  {
    title: 'Test Post 2',
    summary: 'Second test post',
    publishedAt: '2025-01-20',
    slug: 'test-post-2',
    url: '/posts/test-post-2',
    tags: ['test', 'second'],
    draft: false,
  },
  {
    title: 'Draft Post',
    summary: 'This is a draft',
    publishedAt: '2025-01-10',
    slug: 'draft-post',
    url: '/posts/draft-post',
    tags: ['draft'],
    draft: true,
  },
]

// Mock contentlayer/generated
vi.mock('contentlayer/generated', () => ({
  allPosts: mockPosts,
}))

let contentlayerUtils: any

beforeAll(async () => {
  contentlayerUtils = await import('../contentlayer')
})

describe('Contentlayer utilities', () => {
  describe('getAllPosts', () => {
    it('returns all non-draft posts', () => {
      const posts = contentlayerUtils.getAllPosts()
      expect(posts).toHaveLength(2)
      expect(posts.every((post: any) => !post.draft)).toBe(true)
    })

    it('returns posts sorted by published date (newest first)', () => {
      const posts = contentlayerUtils.getAllPosts()
      expect(posts[0].publishedAt).toBe('2025-01-20')
      expect(posts[1].publishedAt).toBe('2025-01-15')
    })
  })

  describe('getPostBySlug', () => {
    it('returns the correct post for a given slug', () => {
      const post = contentlayerUtils.getPostBySlug('test-post-1')
      expect(post?.title).toBe('Test Post 1')
      expect(post?.slug).toBe('test-post-1')
    })

    it('returns undefined for non-existent slug', () => {
      const post = contentlayerUtils.getPostBySlug('non-existent')
      expect(post).toBeUndefined()
    })
  })

  describe('getPostsByTag', () => {
    it('returns posts with the specified tag', () => {
      const posts = contentlayerUtils.getPostsByTag('test')
      expect(posts).toHaveLength(2)
      expect(posts.every((post: any) => post.tags?.includes('test'))).toBe(true)
    })

    it('returns empty array for non-existent tag', () => {
      const posts = contentlayerUtils.getPostsByTag('nonexistent')
      expect(posts).toHaveLength(0)
    })
  })

  describe('getAllTags', () => {
    it('returns all unique tags from non-draft posts', () => {
      const tags = contentlayerUtils.getAllTags()
      expect(tags).toContain('test')
      expect(tags).toContain('first')
      expect(tags).toContain('second')
      expect(tags).not.toContain('draft') // Should not include tags from draft posts
    })

    it('returns tags in alphabetical order', () => {
      const tags = contentlayerUtils.getAllTags()
      const sortedTags = [...tags].sort()
      expect(tags).toEqual(sortedTags)
    })
  })

  describe('getLatestPosts', () => {
    it('returns the specified number of latest posts', () => {
      const posts = contentlayerUtils.getLatestPosts(1)
      expect(posts).toHaveLength(1)
      expect(posts[0].publishedAt).toBe('2025-01-20')
    })

    it('returns default of 5 posts when no count specified', () => {
      const posts = contentlayerUtils.getLatestPosts()
      expect(posts.length).toBeLessThanOrEqual(5)
    })

    it('returns all available posts if count exceeds total', () => {
      const posts = contentlayerUtils.getLatestPosts(10)
      expect(posts).toHaveLength(2) // Only 2 non-draft posts available
    })
  })
})