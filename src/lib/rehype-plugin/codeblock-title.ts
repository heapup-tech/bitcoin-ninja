import { visit } from 'unist-util-visit'
import { isTerminalLanguage } from '../terminal'

export function rehypeCodeBlockTitle() {
  return (tree: any) => {
    visit(tree, (node) => {
      if (node?.type === 'element' && node?.tagName === 'figure') {
        if (!('data-rehype-pretty-code-figure' in node.properties)) return

        const preElement = node.children.at(-1)
        if (preElement.tagName !== 'pre') return

        const hasTitle = node.children.at(0).tagName === 'figcaption'
        const language = preElement.properties['data-language']

        preElement.properties['__withTitle__'] = hasTitle
        preElement.properties['__rawString__'] = node.__rawString__

        if (hasTitle) {
          const codeTitleElement = node.children.at(0)
          codeTitleElement.properties['__rawString__'] = node.__rawString__
        }

        if (isTerminalLanguage(language)) {
          if (!hasTitle) {
            node.children.unshift({
              type: 'element',
              tagName: 'figcaption',
              properties: {
                'data-rehype-pretty-code-title': '',
                __language__: language,
                __rawString__: node.__rawString__
              },
              children: [{ type: 'text', value: 'Terminal' }]
            })
            preElement.properties['__withTitle__'] = true
          } else {
            const codeTitleElement = node.children.at(0)
            codeTitleElement.properties['__language__'] = language
          }
        }
      }
    })
  }
}
