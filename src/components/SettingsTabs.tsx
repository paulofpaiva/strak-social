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

interface SettingsTabsProps {
  className?: string
  activeTab: string
  onTabChange: (tab: string) => void
}

export function SettingsTabs({ className, activeTab, onTabChange }: SettingsTabsProps) {
  return (
    <div className={cn("border-b", className)}>
      <nav className="flex space-x-8 overflow-x-auto">
        {settingsItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors cursor-pointer",
                isActive
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}
