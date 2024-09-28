import { MainNavItem, SidebarNavItem } from '@/types'

interface DocsConfig {
  mainNav: MainNavItem[]
  sidebarNav: SidebarNavItem[]
}

export const docsConfig: DocsConfig = {
  mainNav: [
    {
      title: 'Docs',
      href: '/docs/markdown'
    },
    {
      title: 'Google',
      href: 'https://www.google.com',
      external: true
    }
  ],
  sidebarNav: [
    {
      title: 'Getting Started',
      items: [
        {
          title: 'Markdown',
          href: '/docs/markdown'
        },
        {
          title: 'Built-in Mdx Components',
          href: '/docs/mdx'
        }
      ]
    }
  ]
}
