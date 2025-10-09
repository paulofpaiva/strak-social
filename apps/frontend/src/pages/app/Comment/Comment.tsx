import { useParams, useLocation } from 'react-router-dom'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { CommentCard } from '@/components/comment/CommentCard'
import { InlineCommentForm } from '@/components/comment/InlineCommentForm'
import { CommentCardSkeleton } from '@/components/skeleton/CommentCardSkeleton'
import { CommentListSkeleton } from '@/components/skeleton/CommentListSkeleton'
import { ErrorEmpty } from '@/components/ErrorEmpty'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { useSearchNavigation } from '@/hooks'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import { getCommentReplies } from '@/api/comments'
import { api } from '@/api/auth'
import type { Comment as CommentType } from '@/api/comments'

const getCommentById = async (commentId: string): Promise<CommentType> => {
  const response = await api.get(`/comments/comment/${commentId}`)
  return response.data.data
}

export function Comment() {
  const { id } = useParams<{ id: string }>()
  const location = useLocation()
  
  const { getReturnUrl } = useSearchNavigation({
    basePath: '/comment',
    defaultReturnPath: '/feed'
  })

  const { data: comment, isLoading, isError } = useQuery({
    queryKey: ['comment', id],
    queryFn: () => getCommentById(id!),
    enabled: !!id,
  })

  const {
    data: repliesData,
    isLoading: repliesLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['comment-replies-infinite', id],
    queryFn: ({ pageParam = 1 }) => getCommentReplies(id!, pageParam, 10),
    getNextPageParam: (lastPage) => {
      return lastPage.pagination.hasMore 
        ? lastPage.pagination.page + 1 
        : undefined
    },
    initialPageParam: 1,
    enabled: !!id && !!comment,
  })

  const sentinelRef = useInfiniteScroll(
    () => fetchNextPage(),
    hasNextPage || false,
    isFetchingNextPage
  )

  if (isLoading) {
    return (
      <div className="container mx-auto">
        <CommentCardSkeleton />
        <div className="border-t border-border mt-4" />
      </div>
    )
  }

  if (isError || !comment) {
    return (
      <div className="container mx-auto">
        <Breadcrumb to={getReturnUrl()} label="Back" />
        <div className="py-8">
          <ErrorEmpty
            title="Comment not found"
            description="The comment you're looking for doesn't exist or has been deleted."
          />
        </div>
      </div>
    )
  }

  const replies = repliesData?.pages.flatMap((page) => page.replies) || []

  const searchParams = new URLSearchParams(location.search)
  const returnUrl = searchParams.get('return')
  
  let backUrl: string
  let breadcrumbLabel: string
  
  if (comment.parentCommentId) {
    backUrl = `/comment/${comment.parentCommentId}${location.search}`
    breadcrumbLabel = "Back to Comment"
  } else if (returnUrl) {
    backUrl = returnUrl
    if (returnUrl.startsWith('/post/')) {
      breadcrumbLabel = "Back to Post"
    } else if (returnUrl.startsWith('/comment/')) {
      breadcrumbLabel = "Back to Comment"
    } else {
      breadcrumbLabel = "Back"
    }
  } else {
    backUrl = getReturnUrl()
    breadcrumbLabel = "Back"
  }

  return (
    <div className="container mx-auto overflow-x-hidden">
      <Breadcrumb to={backUrl} label={breadcrumbLabel} />
      
      <div className="border-b border-border">
        <CommentCard 
          comment={comment} 
          isReply={false}
          showRepliesButton={false}
          disableNavigation={true}
          showFullDate={true}
        />
      </div>

      <InlineCommentForm 
        postId={comment.postId}
        parentCommentId={comment.id}
        placeholder="Post your reply"
      />

      {repliesLoading ? (
        <div className="border-t border-border">
          <CommentListSkeleton count={3} />
        </div>
      ) : replies.length > 0 && (
        <div className="border-t border-border">
          {replies.map((reply: CommentType) => (
            <CommentCard
              key={reply.id}
              comment={reply}
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
      )}
    </div>
  )
}
