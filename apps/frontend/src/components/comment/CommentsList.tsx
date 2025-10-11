import { Loader2 } from 'lucide-react'
import { CommentCard } from './CommentCard'
import { usePostComments } from '@/hooks/comment'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import { CommentListSkeleton } from '../skeleton/CommentListSkeleton'
import { ErrorEmpty } from '../ErrorEmpty'

interface CommentsListProps {
  postId: string
}

export function CommentsList({ postId }: CommentsListProps) {

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = usePostComments(postId)

  const sentinelRef = useInfiniteScroll(
    () => fetchNextPage(),
    hasNextPage || false,
    isFetchingNextPage
  )

  if (isLoading) {
    return <CommentListSkeleton />
  }

  if (isError) {
    return (
      <div className="py-8">
        <ErrorEmpty
          title="Failed to load comments"
          description="Something went wrong while loading the comments. Please try again."
        />
      </div>
    )
  }

  const allComments = data?.pages.flatMap((page) => page.comments) || []
  const comments = Array.from(
    new Map(allComments.map(comment => [comment.id, comment])).values()
  )

  if (comments.length === 0) {
    return null
  }

  return (
    <div className="border-t border-border">
      {comments.map((comment) => (
        <CommentCard
          key={comment.id}
          comment={comment}
          showRepliesButton={false}
        />
      ))}

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

