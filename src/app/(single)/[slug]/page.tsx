import { Mdx } from '@/components/mdx-components'
import { TableOfContents } from '@/components/toc'
import { ScrollArea } from '@/components/ui/scroll-area'
import { DocPageProps, getDocFromParams } from '@/lib/doc'
import { getTableOfContents } from '@/lib/toc'
import { cn } from '@/lib/utils'
import { notFound } from 'next/navigation'
import Balancer from 'react-wrap-balancer'

export default async function SingleSlugPage({ params }: DocPageProps) {
  const doc = await getDocFromParams({ params })

  if (!doc) notFound()

  const toc = await getTableOfContents(doc.body.raw)
  console.log(toc)
  // container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10
  return (
    <main className={cn('relative py-6 flex-1')}>
      <div className='relative max-w-[1280px] px-4 mx-auto lg:grid lg:grid-cols-[1fr_200px] lg:gap-10'>
        <div className='w-full min-w-0'>
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
          <div className='mx-auto w-full min-w-0'>
            <div className='pb-12 pt-8'>
              <Mdx code={doc.body.code} />
            </div>
          </div>
        </div>
        {doc.toc && (
          <div className='hidden text-sm lg:block'>
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
      </div>
    </main>
  )
}
