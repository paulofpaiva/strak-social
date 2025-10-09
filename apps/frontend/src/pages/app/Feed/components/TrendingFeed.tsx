import { useInfiniteQuery } from '@tanstack/react-query'
import { getTrendingPostsApi } from '@/api/posts'
import { PostCard } from '@/components/post/PostCard'
import { PostCardSkeleton } from '@/components/skeleton/PostCardSkeleton'
import { useInfiniteScroll } from '@/hooks'
import { Loader2, TrendingUp } from 'lucide-react'
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyMedia } from '@/components/ui/empty'
import { ErrorEmpty } from '@/components/ErrorEmpty'
import { CreatePostInline } from '@/components/post/CreatePostInline'

export function TrendingFeed() {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch
  } = useInfiniteQuery({
    queryKey: ['trending-posts'],
    queryFn: ({ pageParam = 1 }) => getTrendingPostsApi(pageParam, 10),
    getNextPageParam: (lastPage) => {
      return lastPage.pagination.hasMore 
        ? lastPage.pagination.page + 1 
        : undefined
    },
    initialPageParam: 1,
    retry: false,
    refetchOnWindowFocus: false,
  })

  const sentinelRef = useInfiniteScroll(
    () => fetchNextPage(),
    hasNextPage || false,
    isFetchingNextPage
  )

  if (isLoading) {
    return <PostCardSkeleton count={3} />
  }

  if (isError) {
    return (
      <ErrorEmpty
        title="Failed to load posts"
        description="Unable to load trending posts. Please try again."
        onRetry={() => refetch()}
        retryText="Try again"
      />
    )
  }

  const posts = data?.pages.flatMap((page) => page.posts) || []

  if (posts.length === 0) {
    return (
      <>
        <CreatePostInline />
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <TrendingUp className="h-6 w-6" />
            </EmptyMedia>
            <EmptyTitle>No trending posts yet</EmptyTitle>
            <EmptyDescription>
              Trending posts will appear here. Start engaging with posts to see what's popular!
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </>
    )
  }

  return (
    <div>
      <CreatePostInline />
      <div>
        {posts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {hasNextPage && (
        <div ref={sentinelRef} className="flex justify-center py-4">
          {isFetchingNextPage && (
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          )}
        </div>
      )}
    </div>
  )
}

