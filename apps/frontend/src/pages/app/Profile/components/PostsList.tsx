import { useQuery } from '@tanstack/react-query'
import { getUserPostsApi } from '@/api/posts'
import { PostCard } from '../../../../components/post/PostCard'
import { PostCardSkeleton } from '../../../../components/skeleton/PostCardSkeleton'
import { useInfiniteScroll, useInfinitePagination } from '@/hooks'
import { Spinner } from '@/components/ui/spinner'
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyMedia } from '@/components/ui/empty'
import { ErrorEmpty } from '@/components/ErrorEmpty'
import { FileText } from 'lucide-react'

interface PostsListProps {
  userId: string
  className?: string
  readOnly?: boolean
}

export function PostsList({ userId, className, readOnly = false }: PostsListProps) {
  const paginatedData = useInfinitePagination({
    initialPage: 1,
    limit: 10,
  })

  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ['user-posts', userId, paginatedData.page, paginatedData.limit],
    queryFn: () => getUserPostsApi(userId, paginatedData.page, paginatedData.limit),
    enabled: !!userId,
    retry: false,
    refetchOnWindowFocus: false,
  })

  const { items, hasMore, loadMore, totalItems } = useInfinitePagination({
    data: data?.posts,
    currentPage: data?.pagination.page,
    hasMore: data?.pagination.hasMore,
    isFetching,
    limit: 10,
  })

  const setSentinelRef = useInfiniteScroll(
    loadMore,
    hasMore,
    isFetching
  )

  if (error) {
    return (
      <ErrorEmpty
        title="Failed to load posts"
        description="Unable to load posts. Please try again."
        onRetry={() => refetch()}
        retryText="Try again"
      />
    )
  }

  if (isLoading) {
    return (
      <div className={className}>
        <PostCardSkeleton count={3} />
      </div>
    )
  }

  if (!items || items.length === 0) {
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
        {items.map(post => (
          <PostCard key={post.id} post={post} readOnly={readOnly} />
        ))}
      </div>

      {totalItems > 0 && isFetching && (
        <div className="flex justify-center py-6">
          <Spinner size="md" />
        </div>
      )}

      {totalItems > 0 && hasMore && (
        <div ref={setSentinelRef} className="h-1" />
      )}
    </div>
  )
}
