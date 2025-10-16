import { Loader2 } from 'lucide-react'
import { useNewsArticles } from '@/hooks/news'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import { NewsCard } from './NewsCard'
import { NewsCardSkeleton } from '@/components/skeleton/NewsCardSkeleton'
import { ErrorEmpty } from '@/components/ErrorEmpty'

export function FeedRightColumn() {
  const {
    articles,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch
  } = useNewsArticles({
    pageSize: 10,
    country: 'us',
    category: 'technology'
  })

  const sentinelRef = useInfiniteScroll(
    () => fetchNextPage(),
    hasNextPage || false,
    isFetchingNextPage
  )

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="space-y-3 px-4">
          {[...Array(5)].map((_, i) => (
            <NewsCardSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="px-4 pt-4">
        <ErrorEmpty
          title="Failed to load news"
          description="Unable to fetch latest news. Please try again."
          onRetry={() => refetch()}
          retryText="Try again"
        />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      
      <div className="space-y-3 px-4">
        {articles.map((article, index) => (
          <NewsCard key={`${article.url}-${index}`} article={article} />
        ))}
        
        {isFetchingNextPage && (
          <div className="flex justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}
        
        <div ref={sentinelRef} className="h-4" />
      </div>
    </div>
  )
}

