import { useInfiniteQuery } from '@tanstack/react-query'
import { getPostCommentsApi, type Comment } from '@/api/posts'
import { Button } from '@/components/ui/button'
import { MessageCircle } from 'lucide-react'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import { CommentForm } from '../comments/CommentForm'
import { CommentCard } from '../comments/CommentCard'

interface PostCommentsProps {
  postId: string
}

export function PostComments({ postId }: PostCommentsProps) {
  const {
    data: commentsData,
    isLoading: commentsLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['post-comments', postId],
    queryFn: ({ pageParam = 1 }) => getPostCommentsApi(postId, pageParam as number, 3),
    enabled: !!postId,
    getNextPageParam: (lastPage) => {
      return lastPage.pagination?.hasMore ? (lastPage.pagination?.page || 1) + 1 : undefined
    },
    initialPageParam: 1,
  })

  const sentinelRef = useInfiniteScroll(
    () => fetchNextPage(),
    !!hasNextPage,
    isFetchingNextPage
  )

  const comments = commentsData?.pages.flatMap((page: any) => page.comments || []) || []

  return (
    <div className="space-y-4">
      <CommentForm postId={postId} />
      

      {commentsLoading && comments.length === 0 ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border border-border rounded-lg p-4 animate-pulse">
              <div className="flex space-x-3">
                <div className="w-8 h-8 bg-muted rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-muted rounded mb-2 w-1/3"></div>
                  <div className="h-4 bg-muted rounded w-2/3"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : comments.length > 0 ? (
        <>
          {comments.map((comment: Comment, index: number) => (
            <div key={comment.id} className="w-full">
              <CommentCard 
                comment={comment} 
                postId={postId} 
                showReplyButton={true}
              />
              {index < comments.length - 1 && (
                <div className="border-b border-border mx-4" />
              )}
            </div>
          ))}
          
          {hasNextPage && (
            <div className="text-center">
              <Button
                variant="outline"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="w-full"
              >
                {isFetchingNextPage ? 'Loading...' : 'Load more comments'}
              </Button>
            </div>
          )}
          
          <div ref={sentinelRef} className="h-4" />
        </>
      ) : (
        <div className="text-center py-8">
          <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No comments yet. Be the first to comment!</p>
        </div>
      )}
    </div>
  )
}
