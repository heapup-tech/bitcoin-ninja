'use client'

import { docsConfig } from '@/config/docs'
import { siteConfig } from '@/config/site'
import { cn } from '@/lib/utils'
import { ExternalLinkIcon } from '@radix-ui/react-icons'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Badge } from './ui/badge'

export function MainNav() {
  const pathname = usePathname()

  return (
    <div className='mr-4 hidden sm:flex'>
      <Link
        href='/'
        className='relative mr-6 flex items-center space-x-2'
      >
        <span className='hidden font-bold sm:inline-block'>
          {siteConfig.name}
        </span>
      </Link>
      <nav className='hidden items-center space-x-6 text-sm font-medium sm:flex'>
        {docsConfig.mainNav.map((item) => (
          <span key={item.title}>
            {item.comingSoon ? (
              <span className='flex items-center justify-center transition-colors hover:text-foreground/80 text-foreground/60'>
                {item.title}
                <Badge
                  className='ml-1 text-xs p-0.5 -mt-4'
                  variant='secondary'
                >
                  Coming
                </Badge>
              </span>
            ) : (
              <Link
                href={item.href!}
                target={item.external ? '_blank' : undefined}
                className={cn(
                  'flex items-center justify-center transition-colors hover:text-foreground/80',
                  pathname?.startsWith(item.href!)
                    ? 'text-foreground'
                    : 'text-foreground/60'
                )}
              >
                {item.title}
                {item.external && <ExternalLinkIcon className='ml-2 size-4' />}
              </Link>
            )}
          </span>
        ))}
      </nav>
    </div>
  )
}
