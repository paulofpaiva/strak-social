import { useQuery } from '@tanstack/react-query'
import { getUserSuggestionsApi } from '@/api/users'
import { WhoToFollowCard } from './WhoToFollowCard'
import { WhoToFollowSkeleton } from '@/components/skeleton/WhoToFollowSkeleton'
import { ErrorEmpty } from '@/components/ErrorEmpty'

export function FeedLeftColumn() {
  const { data: suggestions, isLoading, isError, refetch } = useQuery({
    queryKey: ['user-suggestions'],
    queryFn: () => getUserSuggestionsApi(8),
    refetchOnWindowFocus: false,
    retry: 1,
  })

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold px-4 pt-4">Who to Follow</h2>
        <div className="space-y-3 px-4">
          <WhoToFollowSkeleton />
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="px-4 pt-4">
        <ErrorEmpty
          title="Failed to load suggestions"
          description="Unable to load user suggestions. Please try again."
          onRetry={() => refetch()}
          retryText="Try again"
        />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold px-4 pt-4">Who to Follow</h2>
      
      <div className="space-y-3 px-4">
        {suggestions && suggestions.length > 0 ? (
          suggestions.map((user) => (
            <WhoToFollowCard 
              key={user.id} 
              user={user}
              onFollowToggle={() => refetch()}
            />
          ))
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            No suggestions available
          </p>
        )}
      </div>
    </div>
  )
}

