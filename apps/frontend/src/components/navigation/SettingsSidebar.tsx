import { cn } from '@/lib/utils'
import { Shield, Palette } from 'lucide-react'

interface SettingsItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

const settingsItems: SettingsItem[] = [
  {
    id: 'account',
    label: 'Account',
    icon: Shield
  },
  {
    id: 'appearance',
    label: 'Appearance',
    icon: Palette
  }
]

interface SettingsSidebarProps {
  className?: string
  activeTab: string
  onTabChange: (tab: string) => void
}

export function SettingsSidebar({ className, activeTab, onTabChange }: SettingsSidebarProps) {
  return (
    <nav className={cn("w-64 space-y-1", className)}>
      {settingsItems.map((item) => {
        const Icon = item.icon
        const isActive = activeTab === item.id
        
        return (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={cn(
              "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors w-full text-left cursor-pointer",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            )}
          >
            <Icon className="mr-3 h-4 w-4" />
            {item.label}
          </button>
        )
      })}
    </nav>
  )
}
