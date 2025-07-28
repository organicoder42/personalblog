import { notFound } from "next/navigation";
import { getPostBySlug, getAllPosts } from "@/lib/contentlayer";
import TagChip from "@/components/tag-chip";
import Link from "next/link";
import { MDXRenderer } from "@/components/mdx-renderer";

interface PostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: PostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {};
  }

  const ogImageUrl = `/api/og?title=${encodeURIComponent(post.title)}&summary=${encodeURIComponent(post.summary)}`;

  return {
    title: post.title,
    description: post.summary,
    keywords: post.tags?.join(', '),
    authors: [{ name: "AI Dev Notes", url: "https://ai-dev-notes.vercel.app" }],
    alternates: {
      canonical: post.url,
    },
    openGraph: {
      title: post.title,
      description: post.summary,
      type: "article",
      publishedTime: post.publishedAt,
      authors: ["AI Dev Notes"],
      url: `https://ai-dev-notes.vercel.app${post.url}`,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.summary,
      images: [ogImageUrl],
    },
  };
}


export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <nav className="mb-8">
        <Link 
          href="/posts" 
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          ← Back to posts
        </Link>
      </nav>

      <article>
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400 text-sm mb-4">
            <time dateTime={post.publishedAt}>
              {new Date(post.publishedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long", 
                day: "numeric"
              })}
            </time>
          </div>
          {post.tags && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag) => (
                <TagChip key={tag} tag={tag} size="md" href={`/tags/${tag}`} />
              ))}
            </div>
          )}
        </header>

        <MDXRenderer post={post} />
      </article>
    </div>
  );
}