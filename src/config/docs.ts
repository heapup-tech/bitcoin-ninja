import { MainNavItem, SidebarNavItem } from '@/types/nav'
import { cryptologySidebar } from './cryptology-sidebar'
import { mainNav } from './main-nav'
import { technicalSidebar } from './technical-sidebar'

interface DocsConfig {
  mainNav: MainNavItem[]
  technical: SidebarNavItem[]
  cryptology: SidebarNavItem[]
}

export const docsConfig: DocsConfig = {
  mainNav: mainNav,
  technical: technicalSidebar,
  cryptology: cryptologySidebar
}
