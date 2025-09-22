import { cn } from '@/lib/utils'
import { FileText, Heart, MessageCircle } from 'lucide-react'

interface ProfileTab {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

const profileTabs: ProfileTab[] = [
  {
    id: 'posts',
    label: 'Posts',
    icon: FileText
  },
  {
    id: 'likes',
    label: 'Likes',
    icon: Heart
  },
  {
    id: 'comments',
    label: 'Comments',
    icon: MessageCircle
  }
]

interface ProfileTabsProps {
  className?: string
  activeTab: string
  onTabChange: (tab: string) => void
}

export function ProfileTabs({ className, activeTab, onTabChange }: ProfileTabsProps) {
  return (
    <div className={cn("border-b", className)}>
      <nav className="flex space-x-8 overflow-x-auto">
        {profileTabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors cursor-pointer",
                isActive
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}
