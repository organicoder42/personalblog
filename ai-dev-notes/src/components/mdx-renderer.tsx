"use client";

import { getMDXComponent } from "next-contentlayer/hooks";
import { useMDXComponents } from "@/components/mdx-components";

interface MDXRendererProps {
  post: {
    body: {
      code: string;
    };
  };
}

export function MDXRenderer({ post }: MDXRendererProps) {
  const MDXContent = getMDXComponent(post.body.code);
  const components = useMDXComponents({});
  
  return (
    <div className="prose prose-gray dark:prose-invert max-w-none">
      <MDXContent components={components} />
    </div>
  );
}