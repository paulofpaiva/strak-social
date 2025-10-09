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
import { useLocation, Link } from 'react-router-dom'
import { EditComment } from './EditComment'
import { DeleteComment } from './DeleteComment'
import { CreateComment } from './CreateComment'
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
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false)
  const [isLiked, setIsLiked] = useState(comment.userLiked)
  const [likesCount, setLikesCount] = useState(comment.likesCount)
  const { user } = useAuthStore()
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

  const getCommentUrl = () => {
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
    
    return `/comment/${comment.id}?return=${returnPath}`
  }

  const hasReplies = comment.repliesCount && comment.repliesCount > 0

  return (
    <article
      className={cn(
        'relative p-4 transition-colors border-b border-border last:border-b-0',
        !disableNavigation && 'cursor-pointer',
        isReply && 'pl-12'
      )}
    >
      {!disableNavigation && (
        <Link 
          to={getCommentUrl()}
          className="absolute inset-0 z-0"
          aria-label={`View comment by ${comment.user.name}`}
        />
      )}
      <div className="flex items-center gap-3 mb-3 relative z-10 pointer-events-none">
        <Link 
          to={`/${comment.user.username}`}
          className="flex-shrink-0 pointer-events-auto relative z-10"
        >
          <Avatar
            src={comment.user.avatar || undefined}
            name={comment.user.name}
            size="md"
          />
        </Link>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="flex flex-col min-w-0 w-fit">
              <div className="flex items-center gap-2">
                <Link 
                  to={`/${comment.user.username}`}
                  className="font-semibold text-foreground truncate hover:underline pointer-events-auto relative z-10"
                >
                  {comment.user.name}
                </Link>
                {comment.user.isVerified && (
                  <BadgeCheck className="h-4 w-4 text-primary flex-shrink-0" />
                )}
                {!showFullDate && (
                  <>
                    <span className="text-muted-foreground text-sm">·</span>
                    <span className="text-muted-foreground text-sm">
                      {formatPostDate(comment.createdAt)}
                    </span>
                  </>
                )}
              </div>
              <Link 
                to={`/${comment.user.username}`}
                className="text-muted-foreground text-sm truncate hover:underline pointer-events-auto relative z-10 w-fit"
              >
                @{comment.user.username}
              </Link>
            </div>
            
            {isOwner && (
              <div className="relative z-10 pointer-events-auto">
                <ResponsiveDropdown
                  trigger={
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="h-5 w-5" />
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
        <div className="mb-3 relative z-10 pointer-events-none">
          <p className="text-foreground whitespace-pre-wrap break-words">
            {comment.content}
          </p>
        </div>
      )}

      {comment.media && comment.media.length > 0 && (
        <div className="mb-3 relative z-10 pointer-events-none">
          <PostMedia media={comment.media as MediaItem[]} />
        </div>
      )}

      {showFullDate && (
        <div className="mb-3 relative z-10 pointer-events-none">
          <p className="text-sm text-muted-foreground">
            {formatFullPostDate(comment.createdAt)}
          </p>
        </div>
      )}

      <div className="flex items-center gap-6 text-muted-foreground text-sm relative z-10 pointer-events-none">
        <button 
          onClick={handleLike}
          disabled={likeMutation.isPending}
          className="flex items-center gap-1.5 hover:text-red-500 transition-colors disabled:opacity-50 cursor-pointer relative z-10 pointer-events-auto"
        >
          <Heart 
            className={cn(
              'h-5 w-5 transition-all',
              isLiked && 'fill-red-500 text-red-500'
            )} 
          />
          <span>{likesCount}</span>
        </button>
        
        <button 
          onClick={setIsCommentModalOpen.bind(null, true)}
          className="flex items-center gap-1.5 hover:text-primary transition-colors cursor-pointer relative z-10 pointer-events-auto"
        >
          <MessageCircle className="h-5 w-5" />
          <span>{comment.repliesCount || 0}</span>
        </button>
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

      <CreateComment
        open={isCommentModalOpen}
        onOpenChange={setIsCommentModalOpen}
        postId={comment.postId}
        parentCommentId={comment.id}
      />
    </article>
  )
}

