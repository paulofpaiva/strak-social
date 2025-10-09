import { useInfiniteQuery } from '@tanstack/react-query'
import { getUserPostsApi } from '@/api/posts'
import { PostCard } from '../../../../components/post/PostCard'
import { PostCardSkeleton } from '../../../../components/skeleton/PostCardSkeleton'
import { useInfiniteScroll } from '@/hooks'
import { Loader2 } from 'lucide-react'
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyMedia } from '@/components/ui/empty'
import { ErrorEmpty } from '@/components/ErrorEmpty'
import { FileText } from 'lucide-react'

interface PostsListProps {
  userId: string
  className?: string
  readOnly?: boolean
}

export function PostsList({ userId, className, readOnly = false }: PostsListProps) {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch
  } = useInfiniteQuery({
    queryKey: ['user-posts', userId],
    queryFn: ({ pageParam = 1 }) => getUserPostsApi(userId, pageParam, 10),
    getNextPageParam: (lastPage) => {
      return lastPage.pagination.hasMore 
        ? lastPage.pagination.page + 1 
        : undefined
    },
    initialPageParam: 1,
    enabled: !!userId,
    retry: false,
    refetchOnWindowFocus: false,
  })

  const sentinelRef = useInfiniteScroll(
    () => fetchNextPage(),
    hasNextPage || false,
    isFetchingNextPage
  )

  if (isLoading) {
    return (
      <div className={className}>
        <PostCardSkeleton count={3} />
      </div>
    )
  }

  if (isError) {
    return (
      <ErrorEmpty
        title="Failed to load posts"
        description="Unable to load posts. Please try again."
        onRetry={() => refetch()}
        retryText="Try again"
      />
    )
  }

  const posts = data?.pages.flatMap((page) => page.posts) || []

  if (posts.length === 0) {
    return (
      <Empty className={className}>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FileText className="h-6 w-6" />
          </EmptyMedia>
          <EmptyTitle>No posts yet</EmptyTitle>
          <EmptyDescription>
            When there are posts, they will appear here.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <div className={className}>
      <div>
        {posts.map(post => (
          <PostCard key={post.id} post={post} readOnly={readOnly} />
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
