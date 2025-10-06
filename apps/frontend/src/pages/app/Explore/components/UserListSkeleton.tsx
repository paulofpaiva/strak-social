import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface UsersSkeletonProps {
  count?: number
  className?: string
}

export function UserListSkeleton({ count = 6, className }: UsersSkeletonProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="flex items-center gap-4">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="flex-1 min-w-0 space-y-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-8 w-24 rounded-full" />
        </div>
      ))}
    </div>
  )
}


