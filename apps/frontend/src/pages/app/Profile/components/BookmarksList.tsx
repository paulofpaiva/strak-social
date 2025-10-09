import { useInfiniteQuery } from '@tanstack/react-query'
import { getBookmarksApi } from '@/api/profile'
import { PostCard } from '../../../../components/post/PostCard'
import { PostCardSkeleton } from '../../../../components/skeleton/PostCardSkeleton'
import { useInfiniteScroll } from '@/hooks'
import { Loader2, Bookmark } from 'lucide-react'
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyMedia } from '@/components/ui/empty'
import { ErrorEmpty } from '@/components/ErrorEmpty'

interface BookmarksListProps {
  className?: string
  search?: string
}

export function BookmarksList({ className, search }: BookmarksListProps) {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch
  } = useInfiniteQuery({
    queryKey: ['bookmarks', search],
    queryFn: ({ pageParam = 1 }) => getBookmarksApi(pageParam, 10, search),
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
    return (
      <div className={className}>
        <PostCardSkeleton count={3} />
      </div>
    )
  }

  if (isError) {
    return (
      <ErrorEmpty
        title="Failed to load bookmarks"
        description="Unable to load bookmarks. Please try again."
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
            <Bookmark className="h-6 w-6" />
          </EmptyMedia>
          <EmptyTitle>
            {search && search.trim().length > 0 
              ? "No bookmarks found" 
              : "No bookmarks yet"
            }
          </EmptyTitle>
          <EmptyDescription>
            {search && search.trim().length > 0
              ? "Try searching with different keywords or check your spelling."
              : "When you bookmark posts, they will appear here."
            }
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <div className={className}>
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

