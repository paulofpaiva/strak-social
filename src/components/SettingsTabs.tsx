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

interface SettingsTabsProps {
  className?: string
}

export function SettingsTabs({ className }: SettingsTabsProps) {
  const location = useLocation()
  const currentPath = location.pathname

  return (
    <div className={cn("border-b", className)}>
      <nav className="flex space-x-8 overflow-x-auto">
        {settingsItems.map((item) => {
          const Icon = item.icon
          const isActive = currentPath === item.path
          
          return (
            <Link
              key={item.id}
              to={item.path}
              className={cn(
                "flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors",
                isActive
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
