'use client'

import { docsConfig } from '@/config/docs'
import { cn } from '@/lib/utils'
import { SidebarNavItem } from '@/types/nav'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useMemo } from 'react'

export function DocsSidebarNav() {
  const pathname = usePathname()

  const items = useMemo(() => {
    if (pathname.includes('/cryptology')) return docsConfig.cryptology
    if (pathname.includes('/supplement')) return docsConfig.supplement
    return docsConfig.technical
  }, [pathname])

  return items.length ? (
    <div className='w-full'>
      {items.map((item, index) => (
        <div
          key={index}
          className={cn('pb-2')}
        >
          <h4
            className={cn(
              'rounded-md px-2 py-0.5 text-sm',
              item.items?.length && 'font-semibold '
            )}
          >
            {item.href ? (
              <Link
                href={item.href}
                className={cn(
                  'hover:text-primary hover:translate-x-1',
                  pathname === item.href && 'text-primary translate-x-1'
                )}
              >
                {item.items?.length ? (
                  item.title
                ) : (
                  <div
                    className={cn(
                      'text-muted-foreground hover:text-primary hover:translate-x-1 transition-transform',
                      pathname === item.href &&
                        'text-primary translate-x-1 font-semibold'
                    )}
                  >
                    {item.title}
                  </div>
                )}
              </Link>
            ) : (
              item.title
            )}
          </h4>
          {item.items?.length && (
            <DocsSidebarNavItems
              items={item.items}
              pathname={pathname}
            />
          )}
        </div>
      ))}
    </div>
  ) : null
}

interface DocsSidebarNavItemsProps {
  items: SidebarNavItem[]
  pathname: string | null
}

export function DocsSidebarNavItems({
  items,
  pathname
}: DocsSidebarNavItemsProps) {
  return items?.length ? (
    <div className='grid grid-flow-row auto-rows-max text-sm'>
      {items.map((item, index) =>
        item.href && !item.disabled ? (
          <Link
            key={index}
            href={item.href}
            className={cn(
              'group flex w-full items-center rounded-md border border-transparent px-2 py-0.5 hover:text-primary hover:translate-x-1 transition-transform',
              item.disabled && 'cursor-not-allowed opacity-60 ',
              pathname === item.href
                ? 'font-semibold text-primary translate-x-1'
                : 'text-muted-foreground'
            )}
            target={item.external ? '_blank' : ''}
            rel={item.external ? 'noreferrer' : ''}
          >
            {item.title}
            {item.label && (
              <span className='ml-2 rounded-md bg-[#adfa1d] px-1.5 py-0.5 text-xs leading-none text-[#000000] no-underline group-hover:no-underline'>
                {item.label}
              </span>
            )}
          </Link>
        ) : (
          <span
            key={index}
            className={cn(
              'flex w-full cursor-not-allowed items-center rounded-md p-2 text-muted-foreground hover:underline',
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
  ) : null
}
