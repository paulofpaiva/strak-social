import type { ReactNode } from 'react'
import { FeedSidebar } from '../components/AppSidebar'
import { BottomNavigation } from '../components/BottomNavigation'
import { AppHeader } from '../components/AppHeader'
import { useIsMobile, useIsCompact } from '../hooks/useIsMobile'
import { cn } from '@/lib/utils'
import { FeedRightColumn } from '@/pages/app/Feed/components/FeedRightColumn'

interface AppLayoutProps {
  children: ReactNode
  showNewsColumn?: boolean
}

export function AppLayout({ children, showNewsColumn = false }: AppLayoutProps) {
  const isMobile = useIsMobile()
  const isCompact = useIsCompact()

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {isMobile && <AppHeader />}
      
      {isMobile ? (
        <main className="w-full px-4 py-4 pb-20">
          {children}
        </main>
      ) : showNewsColumn ? (
        <div className="flex gap-6 max-w-[1400px] mx-auto py-4 px-4">
          <aside className={cn("shrink-0", isCompact ? 'w-16' : 'w-[280px]')}>
            <FeedSidebar isCompact={isCompact} />
          </aside>
          
          <main className="flex-1 min-w-0 max-w-[600px]">
            {children}
          </main>
          
          <aside className="w-[350px] shrink-0">
            <FeedRightColumn />
          </aside>
        </div>
      ) : (
        <div className="flex gap-6 max-w-[1400px] mx-auto py-4 px-4">
          <aside className={cn("shrink-0", isCompact ? 'w-16' : 'w-[280px]')}>
            <FeedSidebar isCompact={isCompact} />
          </aside>
          
          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>
      )}
      
      {isMobile && <BottomNavigation />}
    </div>
  )
}