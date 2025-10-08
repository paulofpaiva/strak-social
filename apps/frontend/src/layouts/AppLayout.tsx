import type { ReactNode } from 'react'
import { FeedSidebar } from '../components/FeedSidebar'
import { BottomNavigation } from '../components/BottomNavigation'
import { AppHeader } from '../components/AppHeader'
import { useIsMobile, useIsCompact } from '../hooks/useIsMobile'

interface AppLayoutProps {
  children: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const isMobile = useIsMobile()
  const isCompact = useIsCompact()

  return (
    <div className="min-h-screen bg-background">
      {isMobile && <AppHeader />}
      
      <div className="flex">
        {!isMobile && (
          <div className={`fixed left-0 top-0 h-full bg-background border-r border-border z-10 ${isCompact ? 'w-16' : 'w-64'}`}>
            <FeedSidebar isCompact={isCompact} />
          </div>
        )}
        
        <div className={`flex-1 ${!isMobile ? (isCompact ? 'ml-16' : 'ml-64') : ''}`}>
          <main className={`max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${isMobile ? 'pb-20' : ''}`}>
            {children}
          </main>
        </div>
      </div>
      
      {isMobile && <BottomNavigation />}
      
    </div>
  )
}