import Link from "next/link";
import { getAllPosts } from "@/lib/contentlayer";

export default function PostsPage() {
  const posts = getAllPosts();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <header className="mb-12">
        <h1 className="text-3xl font-bold mb-4">All Posts</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Browse all {posts.length} posts
        </p>
      </header>

      <main>
        <div className="space-y-8">
          {posts.map((post) => (
            <article key={post.slug} className="border-b border-gray-200 dark:border-gray-700 pb-8">
              <Link href={post.url} className="group">
                <h2 className="text-xl font-semibold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {post.title}
                </h2>
              </Link>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                {new Date(post.publishedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long", 
                  day: "numeric"
                })}
              </p>
              <p className="text-gray-800 dark:text-gray-200 mb-4">
                {post.summary}
              </p>
              {post.tags && (
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/tags/${tag}`}
                      className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No posts found.</p>
          </div>
        )}
      </main>
    </div>
  );
}