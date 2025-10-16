import { Skeleton } from '@/components/ui/skeleton'

export function ListDetailsSkeleton() {
  return (
    <div className="flex flex-col">
      <div className="h-48 sm:h-48 md:h-64 w-full bg-muted" />
      
      <div className="p-4 space-y-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-full max-w-md" />
            </div>
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-1">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-24" />
        </div>

        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  )
}

