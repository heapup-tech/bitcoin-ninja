import { NavItem, NavItemWithChildren, SidebarNavItem } from '@/types/nav'
import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons'
import { TechnicalDoc } from 'content-collections'
import Link from 'next/link'

import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface DocsPagerProps {
  doc: TechnicalDoc
  sidebarNav: SidebarNavItem[]
}

export function DocPager({ doc, sidebarNav }: DocsPagerProps) {
  const pager = getPagerForDoc(doc, sidebarNav)

  if (!pager) {
    return null
  }

  return (
    <div className='flex flex-row items-center justify-between'>
      {pager?.prev?.href && (
        <Link
          href={pager.prev.href}
          className={buttonVariants({ variant: 'outline' })}
        >
          <ChevronLeftIcon className='mr-2 size-4' />
          {pager.prev.title}
        </Link>
      )}
      {pager?.next?.href && (
        <Link
          href={pager.next.href}
          className={cn(buttonVariants({ variant: 'outline' }), 'ml-auto')}
        >
          {pager.next.title}
          <ChevronRightIcon className='ml-2 size-4' />
        </Link>
      )}
    </div>
  )
}

export function getPagerForDoc(
  doc: TechnicalDoc,
  sidebarNav: SidebarNavItem[]
) {
  const flattenedLinks = [null, ...flatten(sidebarNav), null]

  const activeIndex = flattenedLinks.findIndex(
    (link) => doc.slug === link?.href
  )
  const prev = activeIndex !== 0 ? flattenedLinks[activeIndex - 1] : null
  const next =
    activeIndex !== flattenedLinks.length - 1
      ? flattenedLinks[activeIndex + 1]
      : null
  return {
    prev,
    next
  }
}

export function flatten(links: NavItemWithChildren[]): NavItem[] {
  return links
    .reduce<NavItem[]>((flat, link) => {
      return flat.concat(link.items?.length ? flatten(link.items) : link)
    }, [])
    .filter((link) => !link?.disabled)
}
