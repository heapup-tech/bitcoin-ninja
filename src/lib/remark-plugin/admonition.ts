import type { Paragraph, Parent, Text } from 'mdast'
import { findAllBetween } from 'unist-util-find-between-all'
import { visit, Visitor, VisitorResult } from 'unist-util-visit'

export interface AdmonitionNode {
  type: string
  title?: string
  children: Paragraph[]
  start: number
  end: number
}

export const ADMONITION_TYPES = [
  'note',
  'tip',
  'warning',
  'danger',
  'details',
  'code-group'
]
const ADMONITION_START = new RegExp(
  `^:{3}(?:\\s*)(${ADMONITION_TYPES.join('|')}) ?(.+)?`
)
const ADMONITION_END = /\s*\n*?:{3}$/
let admonitionNode: AdmonitionNode | null = null

const visitor: Visitor<Paragraph, Parent> = (
  node,
  index,
  parent
): VisitorResult => {
  if (!parent) return

  const { children } = node
  if (!children || children.length === 0) return
  const firstChild = node.children[0] as Text

  const firstChildValue = firstChild.value || ''

  const startMatch = firstChildValue.match(ADMONITION_START)

  if (startMatch) {
    admonitionNode = {
      type: startMatch[1],
      title: startMatch[2] || '',
      children: [],
      start: index || 0,
      end: 0
    }

    return
  }
  const endMatch = firstChildValue.match(ADMONITION_END)

  if (endMatch && admonitionNode) {
    admonitionNode.end = index!

    const containerNode: any = {
      type: 'element',
      data: {
        hName: 'admonition',
        hProperties: {
          className: `admonition admonition-${admonitionNode.type}`,
          'data-admonition-type': admonitionNode.type
        }
      },
      children: [
        {
          type: 'paragraph',
          data: {
            hProperties: {
              'data-admonition-title': ''
            }
          },
          children: [{ type: 'text', value: admonitionNode.title || '' }]
        },
        ...findAllBetween(
          parent as any,
          admonitionNode.start,
          admonitionNode.end
        )
      ]
    }

    const start = admonitionNode.start
    const end = admonitionNode.end

    // remove original container nodes and replace with new container node
    parent.children.splice(start, end - start + 1, containerNode)
    admonitionNode = null

    return start + 1
  }

  if (admonitionNode) {
    admonitionNode.children.push(node)

    return
  }
}

export function remarkAdmonition() {
  return (tree: any) => {
    visit(tree, 'paragraph', visitor)
  }
}
