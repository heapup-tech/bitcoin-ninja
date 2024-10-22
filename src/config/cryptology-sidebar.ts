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
        title: 'Secp256k1',
        href: '/cryptology/ecc/secp256k1'
      },
      {
        title: 'ECDSA',
        href: '/cryptology/ecc/ecdsa'
      },
      {
        title: 'Schnorr',
        href: '/cryptology/ecc/schnorr'
      }
    ]
  }
]
