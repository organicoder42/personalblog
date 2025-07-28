import { notFound } from "next/navigation";
import Link from "next/link";
import { getPostsByTag, getAllTags } from "@/lib/contentlayer";

interface TagPageProps {
  params: Promise<{
    tag: string;
  }>;
}

export function generateStaticParams() {
  const tags = getAllTags();
  return tags.map((tag) => ({
    tag: tag,
  }));
}

export async function generateMetadata({ params }: TagPageProps) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  const posts = getPostsByTag(decodedTag);

  if (posts.length === 0) {
    return {};
  }

  return {
    title: `${decodedTag} | AI Development Notes`,
    description: `Posts tagged with ${decodedTag}`,
    openGraph: {
      title: `${decodedTag} Posts`,
      description: `Posts tagged with ${decodedTag}`,
      type: "website",
    },
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  const posts = getPostsByTag(decodedTag);

  if (posts.length === 0) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <nav className="mb-8">
        <Link 
          href="/tags" 
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          ← Back to tags
        </Link>
      </nav>

      <header className="mb-12">
        <h1 className="text-3xl font-bold mb-4">
          Posts tagged with &ldquo;{decodedTag}&rdquo;
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {posts.length} {posts.length === 1 ? 'post' : 'posts'} found
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
                      className={`px-2 py-1 text-xs rounded transition-colors ${
                        tag === decodedTag
                          ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}