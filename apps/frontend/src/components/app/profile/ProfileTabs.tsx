import { cn } from '@/lib/utils'

interface ProfileTab {
  id: string
  label: string
}

const profileTabs: ProfileTab[] = [
  {
    id: 'posts',
    label: 'Posts'
  },
  {
    id: 'likes',
    label: 'Likes'
  },
  {
    id: 'comments',
    label: 'Comments'
  }
]

type TabId = 'posts' | 'likes' | 'comments'

interface ProfileTabsProps {
  className?: string
  activeTab: TabId
  onTabChange: (tab: TabId) => void
}

export function ProfileTabs({ className, activeTab, onTabChange }: ProfileTabsProps) {
  return (
    <div className={cn("border-b", className)}>
      <nav className="flex space-x-8 overflow-x-auto">
        {profileTabs.map((tab) => {
          const isActive = activeTab === (tab.id as TabId)
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id as TabId)}
              className={cn(
                "flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors cursor-pointer",
                isActive
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground"
              )}
            >
              <span>{tab.label}</span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}
