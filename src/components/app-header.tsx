'use client'

import { siteConfig } from '@/config/site'
import { cn } from '@/lib/utils'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { Icons } from './icons'
import { MainNav } from './main-nav'
import { MobileNav } from './mobile-nav'
import { buttonVariants } from './ui/button'
const ModeToggle = dynamic(() => import('./mode-toggle'), { ssr: false })

export default function AppHeader() {
  return (
    <header className='sticky top-0 z-50 w-full border-b border-border/40 bg-background/70 backdrop-blur'>
      <div className='container flex h-16 items-center flex-between'>
        <MainNav />
        <MobileNav />
        <div className='flex flex-1 items-center space-x-2 justify-end'>
          <Link
            href={siteConfig.links.github}
            target='_blank'
          >
            <div
              className={cn(
                buttonVariants({
                  variant: 'ghost'
                }),
                'w-9 px-0'
              )}
            >
              <Icons.gitHub className='h-4 w-4' />
              <span className='sr-only'>GitHub</span>
            </div>
          </Link>

          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
