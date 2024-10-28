import { MainNavItem } from '@/types/nav'

export const mainNav: Array<MainNavItem> = [
  {
    title: '深入技术',
    href: '/technical/basic/blockchain'
  },
  {
    title: '密码学',
    href: '/cryptology/ecc/ecc'
  },
  {
    title: '拓展协议',
    href: '/extension',
    items: [
      {
        title: 'BIP',
        href: '/extension/bip/bip'
      }
    ]
  },
  // {
  //   title: '工具集',
  //   href: '/tools',
  //   comingSoon: true
  // },
  // {
  //   title: '测验',
  //   href: '/tools',
  //   comingSoon: true
  // },
  {
    title: '关于',
    href: '/about'
  }
]
