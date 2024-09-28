import { defineDocumentType, makeSource } from 'contentlayer/source-files'
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

export const TechnicalDoc = defineDocumentType(() => ({
  name: 'TechnicalDoc',
  filePathPattern: 'technical/**/*.mdx',
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    description: { type: 'string', required: false },
    draft: { type: 'boolean', required: false, default: false },
    toc: { type: 'boolean', default: true, required: false }
  },
  computedFields: {
    slug: {
      type: 'string',
      resolve: (doc) => `/${doc._raw.flattenedPath}`
    },
    slugAsParams: {
      type: 'string',
      resolve: (doc) => doc._raw.flattenedPath.split('/').slice(1).join('/')
    }
  }
}))

export default makeSource({
  contentDirPath: './content',
  documentTypes: [TechnicalDoc],
  mdx: {
    remarkPlugins: [remarkGfm, remarkAdmonition, remarkMath],
    rehypePlugins: [
      rehypeSlug,
      // @ts-ignore
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
        // @ts-ignore
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
  }
})
