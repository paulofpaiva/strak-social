import { Link, useLocation } from 'react-router'
import { cn } from '@/lib/utils'
import { User, Shield, Palette } from 'lucide-react'

interface SettingsItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  path: string
}

const settingsItems: SettingsItem[] = [
  {
    id: 'profile',
    label: 'Profile',
    icon: User,
    path: '/profile'
  },
  {
    id: 'account',
    label: 'Account',
    icon: Shield,
    path: '/profile/account'
  },
  {
    id: 'appearance',
    label: 'Appearance',
    icon: Palette,
    path: '/profile/appearance'
  }
]

interface SettingsSidebarProps {
  className?: string
  onItemClick?: () => void
}

export function SettingsSidebar({ className, onItemClick }: SettingsSidebarProps) {
  const location = useLocation()
  const currentPath = location.pathname

  return (
    <nav className={cn("w-64 space-y-1", className)}>
      {settingsItems.map((item) => {
        const Icon = item.icon
        const isActive = currentPath === item.path
        
        return (
          <Link
            key={item.id}
            to={item.path}
            onClick={onItemClick}
            className={cn(
              "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            )}
          >
            <Icon className="mr-3 h-4 w-4" />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
