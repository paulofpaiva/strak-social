interface CommentLoadingSkeletonProps {
  count?: number
  isReply?: boolean
}

export function CommentLoadingSkeleton({ count = 3, isReply = false }: CommentLoadingSkeletonProps) {
  return (
    <div className="space-y-3">
      {[...Array(count)].map((_, i) => (
        <div 
          key={i} 
          className={`border border-border rounded-lg p-3 animate-pulse ${isReply ? 'ml-6 bg-muted/20' : ''}`}
        >
          <div className="flex space-x-3">
            <div className="w-8 h-8 bg-muted rounded-full shrink-0"></div>
            
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="h-3 bg-muted rounded w-20"></div>
                  <div className="h-2 bg-muted rounded w-16"></div>
                </div>
                <div className="w-4 h-4 bg-muted rounded"></div>
              </div>
              
              <div className="space-y-1">
                <div className="h-3 bg-muted rounded w-full"></div>
                <div className="h-3 bg-muted rounded w-3/4"></div>
              </div>
              
              {i % 3 === 0 && (
                <div className="h-16 bg-muted rounded w-32"></div>
              )}
              
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center space-x-1">
                  <div className="w-4 h-4 bg-muted rounded"></div>
                  <div className="h-2 bg-muted rounded w-4"></div>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-4 h-4 bg-muted rounded"></div>
                  <div className="h-2 bg-muted rounded w-4"></div>
                </div>
                {!isReply && (
                  <div className="flex items-center space-x-1">
                    <div className="w-4 h-4 bg-muted rounded"></div>
                    <div className="h-2 bg-muted rounded w-8"></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// Skeleton específico para replies (comentários aninhados)
export function CommentRepliesSkeleton({ count = 2 }: { count?: number }) {
  return (
    <div className="mt-3 space-y-2">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="ml-6 animate-pulse">
          <div className="flex space-x-2">
            <div className="w-6 h-6 bg-muted rounded-full shrink-0"></div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center space-x-2">
                <div className="h-2 bg-muted rounded w-16"></div>
                <div className="h-2 bg-muted rounded w-12"></div>
              </div>
              <div className="h-2 bg-muted rounded w-full"></div>
              <div className="h-2 bg-muted rounded w-2/3"></div>
              <div className="flex items-center space-x-2 mt-1">
                <div className="w-3 h-3 bg-muted rounded"></div>
                <div className="h-2 bg-muted rounded w-3"></div>
                <div className="w-3 h-3 bg-muted rounded"></div>
                <div className="h-2 bg-muted rounded w-6"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
