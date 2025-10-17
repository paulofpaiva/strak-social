import type { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { FeedSidebar } from '../components/AppSidebar'
import { BottomNavigation } from '../components/BottomNavigation'
import { AppHeader } from '../components/AppHeader'
import { useIsMobile, useIsCompact } from '../hooks/useIsMobile'
import { useNavigationState } from '../hooks/useNavigationState'
import { Breadcrumb } from '../components/ui/breadcrumb'
import { cn } from '@/lib/utils'
import { FeedRightColumn } from '@/pages/app/Feed/components/FeedRightColumn'

interface AppLayoutProps {
  children: ReactNode
  showNewsColumn?: boolean
}

export function AppLayout({ children, showNewsColumn = false }: AppLayoutProps) {
  const isMobile = useIsMobile()
  const isCompact = useIsCompact()
  const location = useLocation()
  const { getReturnUrl } = useNavigationState()

  const shouldShowBreadcrumb = !location.pathname.startsWith('/feed')

  const renderContent = (content: ReactNode) => (
    <>
      {shouldShowBreadcrumb && (
        <Breadcrumb to={getReturnUrl()} label="Back" className='mb-4'/>
      )}
      {content}
    </>
  )

  return (
    <div className="min-h-screen bg-background">
      {isMobile && <AppHeader />}
      
      {isMobile ? (
        <main className="w-full px-4 py-4 pb-20 overflow-x-hidden">
          {renderContent(children)}
        </main>
      ) : showNewsColumn && !isCompact ? (
        <div className="flex gap-6 max-w-[1400px] mx-auto px-4">
          <aside className={cn("shrink-0 sticky top-0 h-screen overflow-y-auto", isCompact ? 'w-18' : 'w-[280px]')}>
            <FeedSidebar isCompact={isCompact} />
          </aside>
          
          <main className="flex-1 py-4 min-w-0 max-w-[600px]">
            {renderContent(children)}
          </main>
          
          <aside className="w-[350px] shrink-0 sticky bottom-0">
            <FeedRightColumn />
          </aside>
        </div>
      ) : (
        <div className="flex gap-6 max-w-[1400px] mx-auto px-4">
          <aside className={cn("shrink-0 sticky top-0 h-screen overflow-y-auto", isCompact ? 'w-18' : 'w-[280px]')}>
            <FeedSidebar isCompact={isCompact} />
          </aside>
          
          <main className="flex-1 py-4 min-w-0">
            {renderContent(children)}
          </main>
        </div>
      )}
      
      {isMobile && <BottomNavigation />}
    </div>
  )
}
