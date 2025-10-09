import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { CommentCard } from './CommentCard'
import { useCommentReplies } from '@/hooks/comment'

interface CommentRepliesListProps {
  parentCommentId: string
  postId: string
  initialRepliesCount: number
}

export function CommentRepliesList({ 
  parentCommentId, 
  postId,
  initialRepliesCount 
}: CommentRepliesListProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  
  const { data, isLoading, isFetching } = useCommentReplies(
    parentCommentId,
    currentPage,
    isExpanded
  )

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded)
    if (isExpanded) {
      setCurrentPage(1)
    }
  }

  const handleLoadMore = () => {
    setCurrentPage(prev => prev + 1)
  }

  if (initialRepliesCount === 0) {
    return null
  }

  return (
    <div className="border-t border-border mt-2">
      <div className="px-4 py-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleToggleExpand}
          className="text-xs text-primary hover:text-primary/80"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
              Loading...
            </>
          ) : isExpanded ? (
            `Hide replies`
          ) : (
            `View ${initialRepliesCount} ${initialRepliesCount === 1 ? 'reply' : 'replies'}`
          )}
        </Button>
      </div>

      {isExpanded && data && (
        <div>
          {data.replies.map((reply) => (
            <CommentCard
              key={reply.id}
              comment={reply}
              isReply={true}
              showRepliesButton={false}
            />
          ))}

          {data.pagination.hasMore && (
            <div className="px-4 py-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLoadMore}
                disabled={isFetching}
                className="text-xs text-primary hover:text-primary/80"
              >
                {isFetching ? (
                  <>
                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                    Loading...
                  </>
                ) : (
                  'Show more replies'
                )}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

