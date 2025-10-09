import type { ReactNode } from 'react'
import { FeedSidebar } from '../components/AppSidebar'
import { BottomNavigation } from '../components/BottomNavigation'
import { AppHeader } from '../components/AppHeader'
import { useIsMobile, useIsCompact } from '../hooks/useIsMobile'
import { cn } from '@/lib/utils'
import { FeedLeftColumn } from '@/pages/app/Feed/components/FeedLeftColumn'
import { FeedRightColumn } from '@/pages/app/Feed/components/FeedRightColumn'

interface FeedLayoutProps {
  children: ReactNode
}

export function FeedLayout({ children }: FeedLayoutProps) {
  const isMobile = useIsMobile()
  const isCompact = useIsCompact()

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {isMobile && <AppHeader />}
      
      <div className="flex">
        {!isMobile && (
          <div className={`fixed left-0 top-0 h-full bg-background border-r border-border z-10 ${isCompact ? 'w-16' : 'w-64'}`}>
            <FeedSidebar isCompact={isCompact} />
          </div>
        )}
        
        <div className={`flex-1 ${!isMobile ? (isCompact ? 'ml-16' : 'ml-64') : ''}`}>
          {!isMobile && !isCompact ? (
            <div className="flex gap-4 max-w-[1400px] mx-auto py-4">
              <aside className="w-[300px] shrink-0">
                <div className="sticky top-4 h-[calc(100vh-2rem)] overflow-y-auto scrollbar-hide">
                  <FeedLeftColumn />
                </div>
              </aside>
              
              <main className="flex-1 min-w-0 max-w-[600px]">
                {children}
              </main>
              
              <aside className="w-[350px] shrink-0">
                <div className="sticky top-4 h-[calc(100vh-2rem)] overflow-y-auto scrollbar-hide">
                  <FeedRightColumn />
                </div>
              </aside>
            </div>
          ) : (
            <main className={cn(
              'mx-auto py-4 max-w-4xl',
              isMobile ? 'w-full px-4 pb-20' : 'px-4'
            )}>
              {children}
            </main>
          )}
        </div>
      </div>
      
      {isMobile && <BottomNavigation />}
    </div>
  )
}

