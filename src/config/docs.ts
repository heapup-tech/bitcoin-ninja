import { MainNavItem, SidebarNavItem } from '@/types/nav'
import { cryptologySidebar } from './cryptology-sidebar'
import { mainNav } from './main-nav'
import { supplementSidebar } from './supplement-sidebar'
import { technicalSidebar } from './technical-sidebar'

interface DocsConfig {
  mainNav: MainNavItem[]
  technical: SidebarNavItem[]
  cryptology: SidebarNavItem[]
  supplement: SidebarNavItem[]
}

export const docsConfig: DocsConfig = {
  mainNav: mainNav,
  technical: technicalSidebar,
  cryptology: cryptologySidebar,
  supplement: supplementSidebar
}
