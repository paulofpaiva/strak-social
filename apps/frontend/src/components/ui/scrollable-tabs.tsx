import { Tab } from '@headlessui/react'
import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface ScrollableTabsProps {
  tabs: {
    id: string
    label: string
    icon?: React.ComponentType<{ className?: string }>
    content: ReactNode
  }[]
  className?: string
  defaultIndex?: number
}

export function ScrollableTabs({ tabs, className, defaultIndex = 0 }: ScrollableTabsProps) {
  return (
    <div className={cn('w-full', className)}>
      <Tab.Group defaultIndex={defaultIndex}>
        <Tab.List className="flex space-x-1 overflow-x-auto scrollbar-hide pb-2 mb-6">
          <div className="flex space-x-1 min-w-max">
            {tabs.map((tab) => (
              <Tab
                key={tab.id}
                className={({ selected }) =>
                  cn(
                    'flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 whitespace-nowrap',
                    'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
                    selected
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  )
                }
              >
                {tab.icon && <tab.icon className="h-4 w-4" />}
                {tab.label}
              </Tab>
            ))}
          </div>
        </Tab.List>
        
        <Tab.Panels>
          {tabs.map((tab) => (
            <Tab.Panel key={tab.id} className="focus:outline-none">
              {tab.content}
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  )
}
