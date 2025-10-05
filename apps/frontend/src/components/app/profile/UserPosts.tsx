import { useInfiniteQuery } from '@tanstack/react-query'
import { getUserPostsApi, type Post, type ApiResponse } from '@/api/posts'
import { PostCard } from '@/components/app/posts/PostCard'
import { PostLoadingSkeleton } from '@/components/app/posts/PostLoadingSkeleton'
import { useInfiniteScroll } from '@/hooks'

interface UserPostsProps {
  userId: string
}

export function UserPosts({ userId }: UserPostsProps) {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery<ApiResponse<Post[]>, Error>({
    queryKey: ['user-posts', userId],
    queryFn: ({ pageParam = 1 }) => getUserPostsApi(userId, pageParam as number, 3),
    getNextPageParam: (lastPage: ApiResponse<Post[]>) => {
      return lastPage.pagination?.hasMore ? lastPage.pagination.page + 1 : undefined
    },
    initialPageParam: 1,
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnMount: 'always',
  })

  const setSentinelRef = useInfiniteScroll(
    () => fetchNextPage(),
    !!hasNextPage,
    isFetchingNextPage
  )

  // Flatten all pages into a single array of posts
  const allPosts = data?.pages.flatMap((page: ApiResponse<Post[]>) => (page.posts as unknown as Post[]) || []) || []

  if (isLoading) {
    return <PostLoadingSkeleton count={3} />
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Failed to load posts</p>
      </div>
    )
  }

  if (!allPosts || allPosts.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No posts yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {allPosts.map((post: Post) => (
        <PostCard key={post.id} post={post} />
      ))}
      
      {isFetchingNextPage && <PostLoadingSkeleton count={3} />}
      
      {hasNextPage && !isFetchingNextPage && (
        <div ref={setSentinelRef} className="h-4" />
      )}
    </div>
  )
}