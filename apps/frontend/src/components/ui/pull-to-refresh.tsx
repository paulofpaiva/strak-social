import { ReactNode } from 'react'
import { Loader2, RefreshCw } from 'lucide-react'
import { usePullToRefresh } from '@/hooks/usePullToRefresh'
import { cn } from '@/lib/utils'

interface PullToRefreshProps {
  onRefresh: () => Promise<void>
  children: ReactNode
  className?: string
}

export function PullToRefresh({ onRefresh, children, className }: PullToRefreshProps) {
  const {
    containerRef,
    pullDistance,
    pullProgress,
    isRefreshing,
    showRefreshIndicator,
  } = usePullToRefresh({
    onRefresh,
    pullDownThreshold: 80,
    maxPullDown: 150,
  })

  return (
    <div ref={containerRef} className={cn("relative overflow-auto", className)}>
      <div
        className="absolute top-0 left-0 right-0 flex items-center justify-center transition-opacity"
        style={{
          height: `${pullDistance}px`,
          opacity: showRefreshIndicator ? 1 : 0,
        }}
      >
        <div className="flex flex-col items-center justify-center">
          {isRefreshing ? (
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          ) : (
            <RefreshCw
              className={cn(
                "h-6 w-6 text-primary transition-transform",
                pullProgress >= 1 && "rotate-180"
              )}
              style={{
                transform: `rotate(${pullProgress * 180}deg)`,
              }}
            />
          )}
          <span className="text-xs text-muted-foreground mt-1">
            {isRefreshing ? 'Refreshing...' : pullProgress >= 1 ? 'Release to refresh' : 'Pull to refresh'}
          </span>
        </div>
      </div>

      <div
        style={{
          transform: `translateY(${pullDistance}px)`,
          transition: isRefreshing || pullDistance === 0 ? 'transform 0.3s ease' : 'none',
        }}
      >
        {children}
      </div>
    </div>
  )
}

