import { SidebarNavItem } from '@/types/nav'

export const cryptologySidebar: SidebarNavItem[] = [
  {
    title: '椭圆曲线',
    items: [
      {
        title: 'ECC',
        href: '/cryptology/ecc/ecc'
      },
      {
        title: 'ECDH',
        href: '/cryptology/ecc/ecdh'
      },
      {
        title: 'ECDSA',
        href: '/cryptology/ecc/ecdsa'
      },
      {
        title: 'Secp256k1',
        href: '/cryptology/ecc/secp256k1'
      },
      {
        title: 'Schnorr',
        href: '/cryptology/ecc/schnorr'
      }
    ]
  }
]
