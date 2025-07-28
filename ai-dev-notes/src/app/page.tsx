import Link from "next/link";
import { getLatestPosts } from "@/lib/contentlayer";
import TagChip from "@/components/tag-chip";

export default function Home() {
  const posts = getLatestPosts(5);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Horse & Panda</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Personal blog of Horse & Panda
        </p>
      </header>

      <main>
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Latest Posts</h2>
          <div className="space-y-8">
            {posts.map((post) => (
              <article key={post.slug} className="border-b border-gray-200 dark:border-gray-700 pb-8">
                <Link href={post.url} className="group">
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {post.title}
                  </h3>
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
                      <TagChip key={tag} tag={tag} href={`/tags/${tag}`} />
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>

        <div className="text-center">
          <Link 
            href="/posts" 
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            View All Posts
          </Link>
        </div>
      </main>
    </div>
  );
}
