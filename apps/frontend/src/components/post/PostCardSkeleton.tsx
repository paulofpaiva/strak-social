import { cn } from '@/lib/utils'

interface PostCardSkeletonProps {
  className?: string
  count?: number
}

export function PostCardSkeleton({ className, count = 3 }: PostCardSkeletonProps) {
  return (
    <div>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'bg-card p-4 animate-pulse border-b border-border last:border-b-0',
            className
          )}
        >
          <div className="flex items-start gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-muted flex-shrink-0" />
            
            <div className="flex-1 min-w-0 space-y-2">
              <div className="w-32 h-4 rounded bg-muted" />
              <div className="w-24 h-3 rounded bg-muted" />
            </div>
          </div>

          <div className="space-y-2 mb-3">
            <div className="w-full h-4 rounded bg-muted" />
            <div className="w-3/4 h-4 rounded bg-muted" />
          </div>

          {i % 2 === 0 && (
            <div className="mb-3 w-full h-64 rounded-lg bg-muted" />
          )}

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded bg-muted" />
              <div className="w-8 h-4 rounded bg-muted" />
            </div>
            
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded bg-muted" />
              <div className="w-8 h-4 rounded bg-muted" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
