import { Icons } from '@/components/icons'

export interface NavItem {
  title: string
  href?: string
  disabled?: boolean
  external?: boolean
  icon?: keyof typeof Icons
  label?: string
}

export interface NavItemWithChildren extends NavItem {
  items?: NavItemWithChildren[]
}

export interface MainNavItem extends NavItem {
  comingSoon?: boolean
  items?: NavItemWithChildren[]
}

export interface SidebarNavItem extends NavItemWithChildren {}
