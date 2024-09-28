import { defineCollection, defineConfig } from '@content-collections/core'
import { compileMDX } from '@content-collections/mdx'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeKatex from 'rehype-katex'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import { visit } from 'unist-util-visit'
import { themes } from './src/config/theme'
import { rehypeCodeBlockTitle } from './src/lib/rehype-plugin/codeblock-title'
import { remarkAdmonition } from './src/lib/remark-plugin/admonition'
export const TechnicalDoc = defineCollection({
  name: 'TechnicalDoc',
  directory: 'content',
  include: '**/*.mdx',
  schema: (z) => ({
    title: z.string().min(1),
    description: z.string().optional(),
    toc: z.boolean().optional().default(true),
    draft: z.boolean().optional().default(false)
  }),
  transform: async (document, context) => {
    const body = await compileMDX(context, document, {
      remarkPlugins: [remarkGfm, remarkAdmonition, remarkMath],
      rehypePlugins: [
        rehypeSlug,
        rehypeKatex,
        () => (tree) => {
          visit(tree, (node) => {
            if (node?.type === 'element' && node?.tagName === 'pre') {
              const [codeEl] = node.children

              if (codeEl.tagName !== 'code') return
              node.__rawString__ = codeEl.children?.[0].value
            }
          })
        },
        [
          rehypePrettyCode,
          {
            theme: themes
          }
        ],
        rehypeCodeBlockTitle,
        () => (tree) => {
          visit(tree, (node) => {
            if (node?.tagName === 'admonition') {
              node.properties['__admonition_type__'] =
                node.properties['data-admonition-type']

              const { children } = node
              const title = children[0].children[0].value

              if (title) {
                node.properties['__admonition_title__'] = title
              }
            }
          })
        },
        [
          rehypeAutolinkHeadings,
          {
            properties: {
              className: ['anchor'],
              ariaLabel: 'Link to section'
            }
          }
        ]
      ]
    })

    return {
      ...document,
      slug: `/${document._meta.path}`,
      slugAsParams: document._meta.path.split('/').slice(1).join('/'),
      body: {
        raw: document.content,
        code: body
      }
    }
  }
})

export default defineConfig({
  collections: [TechnicalDoc]
})
