import type { MDXComponents } from 'mdx/types'
import Image from 'next/image'
import YouTube from './youtube'
import Loom from './loom'

// Custom Image component with captions
function CustomImage({ src, alt, caption, width = 800, height = 400, className = "", ...props }: { 
  src: string; 
  alt: string; 
  caption?: string;
  width?: number;
  height?: number;
  className?: string;
}) {
  // Return just the image element with margin classes to avoid nesting issues
  // The MDX processor will handle the paragraph wrapping
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={`rounded-lg my-6 ${className}`}
      priority={false}
      quality={85}
      placeholder="empty"
      title={caption} // Use title attribute for caption instead of figcaption
      {...props}
    />
  );
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    YouTube,
    Loom,
    Image: CustomImage,
    img: CustomImage,
    ...components,
  }
}