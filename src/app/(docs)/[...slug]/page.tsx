import { Mdx } from '@/components/mdx-components'
import { DocPager } from '@/components/pager'
import { TableOfContents } from '@/components/toc'
import { docsConfig } from '@/config/docs'
import { mainNav } from '@/config/main-nav'
import { DocPageProps, getDocFromParams } from '@/lib/doc'
import { getTableOfContents } from '@/lib/toc'
import { cn } from '@/lib/utils'
import '@/styles/mdx.css'
import { ChevronRightIcon } from '@radix-ui/react-icons'
import { ScrollArea } from '@radix-ui/react-scroll-area'
import { allDocs } from 'content-collections'

import { notFound } from 'next/navigation'
import Balancer from 'react-wrap-balancer'

export async function generateStaticParams(): Promise<
  DocPageProps['params'][]
> {
  return allDocs
    .filter((doc) => doc.slugAsParams.split('/').length >= 2)
    .map((doc) => {
      return {
        slug: doc.slugAsParams.split('/')
      }
    })
}

export default async function DocPage({ params }: DocPageProps) {
  const doc = await getDocFromParams({ params })

  if (!doc) notFound()

  const toc = await getTableOfContents(doc.body.raw)

  let currentNav = mainNav[0]
  mainNav.forEach((item) => {
    if (
      params &&
      Array.isArray(params.slug) &&
      item.href?.split('/').includes(params.slug[0])
    ) {
      currentNav = item
    }
  })

  return (
    <main
      className={cn('relative py-6 lg:gap-10 lg:py-8 xl:grid ', {
        'xl:grid-cols-[1fr_250px]': doc.toc
      })}
    >
      <div className='mx-auto w-full min-w-0'>
        <div className='mb-4 flex items-center space-x-1 text-sm text-muted-foreground'>
          <div className='overflow-hidden text-ellipsis whitespace-nowrap'>
            {currentNav.title}
          </div>
          <ChevronRightIcon className='h-4 w-4' />
          <div className='font-medium text-foreground'>{doc.title}</div>
        </div>
        <div className='space-y-2'>
          <h1 className={cn('scroll-m-20 text-4xl font-bold tracking-tight')}>
            {doc.title}
          </h1>
          {doc.description && (
            <p className='text-lg text-muted-foreground'>
              <Balancer>{doc.description}</Balancer>
            </p>
          )}
        </div>
        <div className='pb-12 pt-8'>
          <Mdx code={doc.body.code} />
        </div>
        <DocPager
          doc={doc}
          sidebarNav={docsConfig.technical}
        />
      </div>
      {doc.toc && (
        <div className='hidden text-sm xl:block'>
          <div className='sticky top-16 -mt-10 pt-4'>
            <ScrollArea className='pb-10'>
              <div className='space-y-4 sticky top-16 -mt-10 h-[calc(100vh-3.5rem)] py-12'>
                <TableOfContents toc={toc} />
                {/* <Contribute doc={doc} /> */}
              </div>
            </ScrollArea>
          </div>
        </div>
      )}
    </main>
  )
}
