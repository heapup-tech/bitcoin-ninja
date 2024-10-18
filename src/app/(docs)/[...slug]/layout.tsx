import { DocsSidebarNav } from '@/components/sidebar-nav'
import { ScrollArea } from '@/components/ui/scroll-area'
import { docsConfig } from '@/config/docs'

interface DocsLayoutProps {
  children: React.ReactNode
  params: {
    slug: string[] | string
  }
}

export default function DocsLayout({ children, params }: DocsLayoutProps) {
  let sidebar = docsConfig.technical

  if (params && Array.isArray(params.slug) && params.slug[0] === 'cryptology') {
    sidebar = docsConfig.cryptology
  }

  return (
    <div className='container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10'>
      <aside className='fixed top-16 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block '>
        <ScrollArea className='h-full py-6 pr-6 lg:py-8'>
          <DocsSidebarNav items={sidebar} />
        </ScrollArea>
      </aside>
      {children}
    </div>
  )
}
