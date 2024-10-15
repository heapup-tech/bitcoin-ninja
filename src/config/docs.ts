import { MainNavItem, SidebarNavItem } from '@/types/nav'
import { mainNav } from './main-nav'
import { technicalSidebar } from './technical-sidebar'

interface DocsConfig {
  mainNav: MainNavItem[]
  technical: SidebarNavItem[]
}

export const docsConfig: DocsConfig = {
  mainNav: mainNav,
  technical: technicalSidebar
}
