export function FollowListSkeleton() {
  return (
    <div className="space-y-4 pt-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="w-40 h-3 rounded bg-muted animate-pulse" />
            <div className="w-24 h-3 rounded bg-muted animate-pulse" />
          </div>
          <div className="w-20 h-8 rounded-full bg-muted animate-pulse" />
        </div>
      ))}
    </div>
  )
}


