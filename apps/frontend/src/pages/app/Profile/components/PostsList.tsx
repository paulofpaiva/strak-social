import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getUserPostsApi } from '@/api/posts'
import type { Post } from '@/api/posts'
import { PostCard } from '../../../../components/post/PostCard'
import { PostCardSkeleton } from '../../../../components/post/PostCardSkeleton'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import { Spinner } from '@/components/ui/spinner'
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyMedia } from '@/components/ui/empty'
import { ErrorEmpty } from '@/components/ErrorEmpty'
import { FileText } from 'lucide-react'

interface PostsListProps {
  userId: string
  className?: string
}

export function PostsList({ userId, className }: PostsListProps) {
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [allPosts, setAllPosts] = useState<Post[]>([])

  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ['user-posts', userId, page, limit],
    queryFn: () => getUserPostsApi(userId, page, limit),
    enabled: !!userId,
    retry: false,
    refetchOnWindowFocus: false,
  })

  useMemo(() => {
    if (data?.posts) {
      if (page === 1) {
        setAllPosts(data.posts)
      } else {
        setAllPosts(prev => [...prev, ...data.posts])
      }
    }
  }, [data?.posts, page])

  const loadMore = () => {
    if (data?.pagination.hasMore && !isFetching) {
      setPage(prev => prev + 1)
    }
  }

  const setSentinelRef = useInfiniteScroll(
    loadMore,
    data?.pagination.hasMore || false,
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

  if (!allPosts || allPosts.length === 0) {
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
        {allPosts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {allPosts.length > 0 && isFetching && (
        <div className="flex justify-center py-6">
          <Spinner size="md" />
        </div>
      )}

      {allPosts.length > 0 && data?.pagination.hasMore && (
        <div ref={setSentinelRef} className="h-1" />
      )}
    </div>
  )
}
