import { Skeleton } from '@/components/ui/skeleton'

export function WhoToFollowSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex items-start gap-3 rounded-lg border border-border bg-card p-3">
          <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-full" />
          </div>
          <Skeleton className="h-8 w-16 flex-shrink-0" />
        </div>
      ))}
    </div>
  )
}

