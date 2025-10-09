import { cn } from '@/lib/utils'
import { Avatar } from '@/components/ui/avatar'
import { PostMedia, type MediaItem } from '../post/PostMedia'
import { formatPostDate, formatFullPostDate } from '@/utils/date'
import type { Comment } from '@/api/comments'
import { Heart, MessageCircle, MoreVertical, Trash2, Edit, BadgeCheck } from 'lucide-react'
import { ResponsiveDropdown } from '@/components/ui/responsive-dropdown'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/authStore'
import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { EditComment } from './EditComment'
import { DeleteComment } from './DeleteComment'
import { useLikeCommentMutation } from '@/hooks/comment'

interface CommentCardProps {
  comment: Comment
  isReply?: boolean
  onReplyClick?: () => void
  onViewRepliesClick?: () => void
  showRepliesButton?: boolean
  disableNavigation?: boolean
  showFullDate?: boolean
}

export function CommentCard({ 
  comment, 
  isReply = false, 
  onReplyClick,
  onViewRepliesClick,
  showRepliesButton = true,
  disableNavigation = false,
  showFullDate = false
}: CommentCardProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isLiked, setIsLiked] = useState(comment.userLiked)
  const [likesCount, setLikesCount] = useState(comment.likesCount)
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const isOwner = user?.id === comment.userId
  const likeMutation = useLikeCommentMutation()

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1)
    
    likeMutation.mutate(
      { 
        commentId: comment.id, 
        postId: comment.postId,
        parentCommentId: comment.parentCommentId || undefined
      },
      {
        onError: () => {
          setIsLiked(isLiked)
          setLikesCount(likesCount)
        }
      }
    )
  }

  const handleNavigateToComment = () => {
    if (disableNavigation) return
    
    const searchParams = new URLSearchParams(location.search)
    const currentReturn = searchParams.get('return')
    
    let returnPath: string
    if (location.pathname.startsWith('/post/')) {
      returnPath = location.pathname + (currentReturn ? `?return=${currentReturn}` : '')
    } else if (currentReturn) {
      returnPath = currentReturn
    } else {
      returnPath = location.pathname
    }
    
    navigate(`/comment/${comment.id}?return=${returnPath}`)
  }

  const hasReplies = comment.repliesCount && comment.repliesCount > 0

  return (
    <article
      onClick={disableNavigation ? undefined : handleNavigateToComment}
      className={cn(
        'p-4 transition-colors border-b border-border last:border-b-0',
        !disableNavigation && 'cursor-pointer',
        isReply && 'pl-12'
      )}
    >
      <div className="flex items-start gap-3 mb-2">
        <Avatar
          src={comment.user.avatar || undefined}
          name={comment.user.name}
          size="sm"
          className="flex-shrink-0"
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1 flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-foreground text-sm truncate">
                  {comment.user.name}
                </span>
                {comment.user.isVerified && (
                  <BadgeCheck className="h-4 w-4 text-primary flex-shrink-0" />
                )}
                {!showFullDate && (
                  <span className="text-muted-foreground text-xs ml-auto">
                    {formatPostDate(comment.createdAt)}
                  </span>
                )}
              </div>
              <span className="text-muted-foreground text-xs truncate">
                @{comment.user.username}
              </span>
            </div>
            
            {isOwner && (
              <div onClick={(e) => e.stopPropagation()} className="flex-shrink-0">
                <ResponsiveDropdown
                  trigger={
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  }
                  items={[
                    {
                      label: 'Edit',
                      icon: <Edit className="h-4 w-4" />,
                      onClick: () => setIsEditModalOpen(true),
                      variant: 'default'
                    },
                    {
                      label: 'Delete',
                      icon: <Trash2 className="h-4 w-4" />,
                      onClick: () => setIsDeleteModalOpen(true),
                      variant: 'destructive'
                    }
                  ]}
                  align="end"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {comment.content && (
        <div className="mb-2 ml-11">
          <p className="text-foreground text-sm whitespace-pre-wrap break-words">
            {comment.content}
          </p>
        </div>
      )}

      {comment.media && comment.media.length > 0 && (
        <div className="mb-2 ml-11">
          <PostMedia media={comment.media as MediaItem[]} />
        </div>
      )}

      {showFullDate && (
        <div className="mb-2 ml-11">
          <p className="text-sm text-muted-foreground">
            {formatFullPostDate(comment.createdAt)}
          </p>
        </div>
      )}

      <div className="flex items-center gap-4 text-muted-foreground text-sm ml-11">
        <button 
          onClick={(e) => {
            e.stopPropagation()
            handleLike()
          }}
          disabled={likeMutation.isPending}
          className="flex items-center gap-1.5 hover:text-red-500 transition-colors disabled:opacity-50 cursor-pointer"
        >
          <Heart 
            className={cn(
              'h-4 w-4 transition-all',
              isLiked && 'fill-red-500 text-red-500'
            )} 
          />
          <span className="text-xs">{likesCount}</span>
        </button>
        
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <MessageCircle className="h-4 w-4" />
          <span className="text-xs">{comment.repliesCount || 0}</span>
        </div>
      </div>

      {isOwner && (
        <>
          <EditComment
            open={isEditModalOpen}
            onOpenChange={setIsEditModalOpen}
            comment={comment}
          />

          <DeleteComment
            open={isDeleteModalOpen}
            onOpenChange={setIsDeleteModalOpen}
            comment={comment}
          />
        </>
      )}
    </article>
  )
}

