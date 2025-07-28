import { defineDocumentType, makeSource } from 'contentlayer/source-files'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'

export const Post = defineDocumentType(() => ({
  name: 'Post',
  filePathPattern: '**/*.mdx',
  contentType: 'mdx',
  fields: {
    title: {
      type: 'string',
      description: 'The title of the post',
      required: true,
    },
    publishedAt: {
      type: 'date',
      description: 'The date the post was published',
      required: true,
    },
    summary: {
      type: 'string',
      description: 'A short summary of the post',
      required: true,
    },
    image: {
      type: 'string',
      description: 'The path to the hero image',
      required: false,
    },
    tags: {
      type: 'list',
      of: { type: 'string' },
      description: 'List of tags for the post',
      required: false,
    },
    draft: {
      type: 'boolean',
      description: 'Whether the post is a draft',
      required: false,
      default: false,
    },
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: (post) => `/posts/${post._raw.flattenedPath}`,
    },
    slug: {
      type: 'string',
      resolve: (post) => post._raw.flattenedPath,
    },
  },
}))

export default makeSource({
  contentDirPath: './content/posts',
  documentTypes: [Post],
  mdx: {
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          properties: {
            className: ['subheading-anchor'],
            ariaLabel: 'Link to section',
          },
        },
      ],
    ],
  },
})