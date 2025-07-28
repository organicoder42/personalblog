import { allPosts, Post } from 'contentlayer/generated'

export function getAllPosts(): Post[] {
  return allPosts
    .filter((post) => !post.draft)
    .sort((a, b) => {
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    })
}

export function getPostBySlug(slug: string): Post | undefined {
  return allPosts.find((post) => post.slug === slug)
}

export function getPostsByTag(tag: string): Post[] {
  return getAllPosts().filter((post) => 
    post.tags?.includes(tag)
  )
}

export function getAllTags(): string[] {
  const tags = new Set<string>()
  
  allPosts.forEach((post) => {
    post.tags?.forEach((tag) => tags.add(tag))
  })
  
  return Array.from(tags).sort()
}

export function getLatestPosts(count: number = 5): Post[] {
  return getAllPosts().slice(0, count)
}