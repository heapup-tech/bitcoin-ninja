'use client'

import { themes } from '@/config/theme'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { CopyButton } from './copy-button'

export default function CodeBlock({
  code,
  language
}: {
  code: string
  language: string
}) {
  const [htmlCode, setHtmlCode] = useState('')

  import('shiki')
    .then((shiki) => {
      return shiki.codeToHtml(code, {
        lang: language,
        themes: themes,
        transformers: [
          {
            code(node) {
              this.addClassToHast(
                node,
                'relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-base'
              )
              node.properties['data-language'] = language
              node.properties['style'] = 'display: grid'
              node.properties['data-theme'] = Object.values(themes).join(' ')
            },
            line(node) {
              node.properties['data-line'] = ''
            },
            pre(node) {
              this.addClassToHast(
                node,
                'max-h-[650px] overflow-x-auto rounded-lg border py-4'
              )
              node.properties['data-language'] = language
              node.properties['data-theme'] = Object.values(themes).join(' ')
            }
          }
        ]
      })
    })
    .then((html) => {
      setHtmlCode(html)
    })

  return (
    <div className='relative'>
      <figure
        data-rehype-pretty-code-figure=''
        dangerouslySetInnerHTML={{
          __html: htmlCode
        }}
      ></figure>{' '}
      <CopyButton
        value={code}
        className={cn(
          'absolute right-4 top-4 text-zinc-400 dark:text-zinc-400'
        )}
      />
    </div>
  )
}
