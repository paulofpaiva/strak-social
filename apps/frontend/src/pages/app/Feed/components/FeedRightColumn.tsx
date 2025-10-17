import { useNewsArticles } from '@/hooks/news'
import { useAuth } from '@/hooks'
import { NewsCard } from './NewsCard'
import { NewsCardSkeleton } from '@/components/skeleton/NewsCardSkeleton'
import { ErrorEmpty } from '@/components/ErrorEmpty'
import { VerificationAlert } from '@/components/verified'

export function FeedRightColumn() {
  const { user } = useAuth()
  
  const {
    articles,
    isLoading,
    isError,
    refetch
  } = useNewsArticles({
    pageSize: 3,
    country: 'us',
    category: 'technology'
  })

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="space-y-3 px-4">
          {[...Array(3)].map((_, i) => (
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
    <div className="space-y-4 pt-4">
      {user && !user.isVerified && (
        <div className="px-4 pt-4">
          <VerificationAlert />
        </div>
      )}
      
      <div className="space-y-3 px-4">
        {articles.map((article, index) => (
          <NewsCard key={`${article.url}-${index}`} article={article} />
        ))}
      </div>
    </div>
  )
}

