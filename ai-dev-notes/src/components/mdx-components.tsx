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
  return (
    <figure className="my-6">
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`rounded-lg ${className}`}
        priority={false}
        quality={85}
        placeholder="empty"
        {...props}
      />
      {caption && (
        <figcaption className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2 italic">
          {caption}
        </figcaption>
      )}
    </figure>
  )
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