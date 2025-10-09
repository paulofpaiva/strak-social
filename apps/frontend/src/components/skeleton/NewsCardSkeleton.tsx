import { Skeleton } from '@/components/ui/skeleton'

export function NewsCardSkeleton() {
  return (
    <div className="rounded-lg border border-border bg-card p-3 space-y-2">
      <Skeleton className="aspect-video w-full rounded-md" />
      
      <div className="flex items-center gap-2">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-3 w-16" />
      </div>
      
      <div className="space-y-1">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
      
      <div className="space-y-1">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      
      <Skeleton className="h-3 w-20" />
    </div>
  )
}

