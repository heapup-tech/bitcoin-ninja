'use client'

import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { docsConfig } from '@/config/docs'
import { siteConfig } from '@/config/site'
import { cn } from '@/lib/utils'
import { SidebarNavItem } from '@/types/nav'
import { SidebarOpen } from 'lucide-react'
import Link, { LinkProps } from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import * as React from 'react'

export function MobileNav() {
  const [open, setOpen] = React.useState(false)
  const { slug } = useParams()

  let sidebarNav: SidebarNavItem[] = []
  if (Array.isArray(slug) && slug[0]) {
    sidebarNav = docsConfig[slug[0] as keyof typeof docsConfig]
  }

  return (
    <Sheet
      open={open}
      onOpenChange={setOpen}
    >
      <SheetTrigger asChild>
        <Button
          variant='ghost'
          className='mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 sm:hidden'
        >
          <SidebarOpen className='size-6' />
          <span className='sr-only'>Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side='left'
        className='pr-0 pb-4'
      >
        <MobileLink
          href='/'
          className='flex items-center gap-x-2'
          onOpenChange={setOpen}
        >
          <span className='font-bold'>{siteConfig.name}</span>
        </MobileLink>
        <ScrollArea className='my-4 h-[calc(100vh-5rem)] pl-6 mb-0'>
          <div className='flex flex-col space-y-3'>
            {docsConfig.mainNav?.map(
              (item) =>
                item.href && (
                  <MobileLink
                    key={item.href}
                    href={item.href}
                    onOpenChange={setOpen}
                  >
                    {item.title}
                  </MobileLink>
                )
            )}
          </div>
          <div className='flex flex-col space-y-2'>
            {sidebarNav.map((item, index) => (
              <div
                key={index}
                className='flex flex-col space-y-3 pt-6'
              >
                <h4 className='font-medium'>{item.title}</h4>
                {item.items?.map((item) =>
                  !item.disabled && item.href ? (
                    <MobileLink
                      key={item.href}
                      href={item.href}
                      onOpenChange={setOpen}
                      className={cn(
                        'text-muted-foreground',
                        item.disabled && 'cursor-not-allowed opacity-60'
                      )}
                    >
                      {item.title}
                      {item.label && (
                        <span className='ml-2 rounded-md bg-[#FFBD7A] px-1.5 py-0.5 text-xs leading-none text-[#000000] no-underline group-hover:no-underline'>
                          {item.label}
                        </span>
                      )}
                    </MobileLink>
                  ) : (
                    <span
                      key={index}
                      className={cn(
                        'text-muted-foreground',
                        item.disabled && 'cursor-not-allowed opacity-60'
                      )}
                    >
                      {item.title}
                      {item.label && (
                        <span className='ml-2 rounded-md bg-muted px-1.5 py-0.5 text-xs leading-none text-muted-foreground no-underline group-hover:no-underline'>
                          {item.label}
                        </span>
                      )}
                    </span>
                  )
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

interface MobileLinkProps extends LinkProps {
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
  className?: string
}

function MobileLink({
  href,
  onOpenChange,
  className,
  children,
  ...props
}: MobileLinkProps) {
  const router = useRouter()
  return (
    <Link
      href={href}
      onClick={() => {
        router.push(href.toString())
        onOpenChange?.(false)
      }}
      className={cn(className)}
      {...props}
    >
      {children}
    </Link>
  )
}
