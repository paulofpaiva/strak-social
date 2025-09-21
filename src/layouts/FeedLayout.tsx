import type { ReactNode } from 'react'
import { FeedSidebar } from '../components/FeedSidebar'

interface FeedLayoutProps {
  children: ReactNode
}

export function FeedLayout({ children }: FeedLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <div className="hidden lg:block fixed left-0 top-0 h-full w-64 bg-background border-r border-border z-10">
          <FeedSidebar />
        </div>
        
        <div className="flex-1 lg:ml-64">
          <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
