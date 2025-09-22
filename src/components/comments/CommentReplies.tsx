import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { getCommentRepliesApi, getCommentApi, type Comment } from '@/api/posts'
import { Button } from '@/components/ui/button'
import { MessageCircle } from 'lucide-react'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import { CommentForm } from './CommentForm'
import { CommentCard } from './CommentCard'

interface CommentRepliesProps {
  commentId: string
  postId: string
  showCommentForm?: boolean
}

// Component for individual reply with complete data
function ReplyCard({ reply, postId, index, totalReplies }: { 
  reply: Comment, 
  postId: string, 
  index: number, 
  totalReplies: number 
}) {
  const { data: completeCommentData } = useQuery({
    queryKey: ['comment', reply.id],
    queryFn: () => getCommentApi(reply.id),
    enabled: reply.repliesCount === undefined, // Only fetch if repliesCount is missing
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  const completeReply = completeCommentData?.comment || reply

  return (
    <div className="w-full">
      <CommentCard 
        comment={completeReply} 
        postId={postId} 
        showReplyButton={true}
        isReply={true}
      />
      {index < totalReplies - 1 && (
        <div className="border-b border-border mx-4" />
      )}
    </div>
  )
}

export function CommentReplies({ commentId, postId, showCommentForm = true }: CommentRepliesProps) {
  const {
    data: repliesData,
    isLoading: repliesLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['comment-replies', commentId],
    queryFn: ({ pageParam = 1 }) => getCommentRepliesApi(commentId, pageParam as number, 10),
    enabled: !!commentId,
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

  const replies = repliesData?.pages.flatMap((page: any) => page.replies || []) || []

  return (
    <div className="space-y-4">
      {showCommentForm && (
        <>
          <CommentForm postId={postId} parentCommentId={commentId} isReplyForm={true} />
          <div className="border-t border-border"></div>
        </>
      )}

      {repliesLoading && replies.length === 0 ? (
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
      ) : replies.length > 0 ? (
        <>
          {replies.map((reply: Comment, index: number) => (
            <ReplyCard
              key={reply.id}
              reply={reply}
              postId={postId}
              index={index}
              totalReplies={replies.length}
            />
          ))}
          
          {hasNextPage && (
            <div className="text-center">
              <Button
                variant="outline"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="w-full"
              >
                {isFetchingNextPage ? 'Loading...' : 'Load more replies'}
              </Button>
            </div>
          )}
          
          <div ref={sentinelRef} className="h-4" />
        </>
      ) : (
        <div className="text-center py-8">
          <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No replies yet. Be the first to reply!</p>
        </div>
      )}
    </div>
  )
}
