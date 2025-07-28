import Link from "next/link";
import { getAllTags, getPostsByTag } from "@/lib/contentlayer";

export default function TagsPage() {
  const tags = getAllTags();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <header className="mb-12">
        <h1 className="text-3xl font-bold mb-4">All Tags</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Browse posts by topic
        </p>
      </header>

      <main>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tags.map((tag) => {
            const postCount = getPostsByTag(tag).length;
            return (
              <Link
                key={tag}
                href={`/tags/${tag}`}
                className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors group"
              >
                <h2 className="text-xl font-semibold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {tag}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {postCount} {postCount === 1 ? 'post' : 'posts'}
                </p>
              </Link>
            );
          })}
        </div>

        {tags.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No tags found.</p>
          </div>
        )}
      </main>
    </div>
  );
}