import { LucideIcon, Home, Search, User, Settings, Plus, LogOut } from "lucide-react"

export interface NavigationItem {
  id: string
  label: string
  icon: LucideIcon
  href: string
  matchPattern?: 'exact' | 'startsWith'
  showBottom?: boolean
  showDesktopSidebar?: boolean
  showMobileSidebar?: boolean
  showLabel?: boolean
  action?: () => void
  variant?: 'default' | 'destructive'
}

export const navigationItems: NavigationItem[] = [
  {
    id: 'home',
    label: 'Home',
    icon: Home,
    href: '/feed',
    matchPattern: 'exact',
    showBottom: true,
    showDesktopSidebar: true,
    showMobileSidebar: true,
    showLabel: true
  },
  {
    id: 'explore',
    label: 'Explore',
    icon: Search,
    href: '/explore',
    matchPattern: 'exact',
    showBottom: true,
    showDesktopSidebar: true,
    showMobileSidebar: true,
    showLabel: true
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: User,
    href: '/profile',
    matchPattern: 'startsWith',
    showBottom: true,
    showDesktopSidebar: true,
    showMobileSidebar: false,
    showLabel: true
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    href: '/settings',
    matchPattern: 'startsWith',
    showBottom: true,
    showDesktopSidebar: true,
    showMobileSidebar: false,
    showLabel: true
  }
]

export const actionItems: NavigationItem[] = [
  {
    id: 'create-post',
    label: 'Post',
    icon: Plus,
    href: '#',
    showBottom: true,
    showDesktopSidebar: true,
    showMobileSidebar: false,
    showLabel: true
  }
]

export interface UserMenuItem {
  id: string
  label: string
  icon: LucideIcon
  href?: string
  action?: 'logout' | 'custom'
  variant?: 'default' | 'destructive'
  showInDesktopSidebar?: boolean
  showInMobileSidebar?: boolean
}

export const userMenuItems: UserMenuItem[] = [
  {
    id: 'profile',
    label: 'Profile',
    icon: User,
    href: '/profile',
    showInDesktopSidebar: false,
    showInMobileSidebar: true
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    href: '/settings',
    showInDesktopSidebar: true,
    showInMobileSidebar: true
  },
  {
    id: 'logout',
    label: 'Log out',
    icon: LogOut,
    action: 'logout',
    variant: 'destructive',
    showInDesktopSidebar: true,
    showInMobileSidebar: true
  }
]

export const getLogoutItem = (): NavigationItem => ({
  id: 'logout',
  label: 'Log out',
  icon: LogOut,
  href: '#',
  variant: 'destructive',
  showBottom: false,
  showDesktopSidebar: true,
  showMobileSidebar: true,
  showLabel: true
})

export const getBottomNavItems = () => 
  navigationItems.filter(item => item.showBottom)

export const getDesktopSidebarItems = () => 
  navigationItems.filter(item => item.showDesktopSidebar)

export const getMobileSidebarItems = () => 
  navigationItems.filter(item => item.showMobileSidebar)

export const getDesktopActionItems = () =>
  actionItems.filter(item => item.showDesktopSidebar)

export const getMobileSidebarActionItems = () =>
  actionItems.filter(item => item.showMobileSidebar)

export const getBottomActionItems = () =>
  actionItems.filter(item => item.showBottom)

export const getUserMenuItemsForDesktop = () =>
  userMenuItems.filter(item => item.showInDesktopSidebar)

export const getUserMenuItemsForMobile = () =>
  userMenuItems.filter(item => item.showInMobileSidebar)

