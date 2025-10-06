import { cn } from '@/lib/utils'
import { useIsMobile, useIsCompact } from '@/hooks/useIsMobile'
import type { ReactNode } from 'react'

interface TabsProps {
  className?: string
  activeTab: string
  onTabChange: (tab: string) => void
  tabs: {
    id: string
    label: string
    icon: React.ComponentType<{ className?: string }>
    content: ReactNode
  }[]
}

export function ResponsiveTabs({ className, activeTab, onTabChange, tabs }: TabsProps) {
  const isMobile = useIsMobile()
  const isCompact = useIsCompact()
  const shouldUseTabs = isCompact || isMobile

  const activeTabContent = tabs.find(tab => tab.id === activeTab)?.content

  if (shouldUseTabs) {
    return (
      <div className={cn("", className)}>
        <nav className="flex space-x-8 overflow-x-auto border-b">
          {tabs.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={cn(
                  "flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors cursor-pointer",
                  isActive
                    ? "border-primary-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>
        
        <div className="mt-6">
          <div className="rounded-lg">
            {activeTabContent}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex">
      <nav className={cn("w-64 space-y-1", className)}>
        {tabs.map((item) => {
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
      
      <div className="flex-1 ml-6">
        <div className="rounded-lg">
          {activeTabContent}
        </div>
      </div>
    </div>
  )
}
