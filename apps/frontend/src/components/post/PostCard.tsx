import { cn } from '@/lib/utils'
import { Avatar } from '@/components/ui/avatar'
import { PostMedia } from './PostMedia'
import { formatPostDate, formatFullPostDate } from '@/utils/date'
import type { Post } from '@/api/posts'
import { Heart, MessageCircle, MoreVertical, Trash2, Edit, BadgeCheck, Bookmark, Share, Link as LinkIcon } from 'lucide-react'
import { ResponsiveDropdown } from '@/components/ui/responsive-dropdown'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/authStore'
import { useState } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { EditPost } from './EditPost'
import { DeletePost } from './DeletePost'
import { CreateComment } from '@/components/comment/CreateComment'
import { useLikePostMutation, useBookmarkPostMutation } from '@/hooks/post'
import { toast } from 'sonner'

interface PostCardProps {
  post: Post
  className?: string
  readOnly?: boolean
  disableNavigation?: boolean
  isPostView?: boolean
}

export function PostCard({ post, className, readOnly = false, disableNavigation = false, isPostView = false }: PostCardProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false)
  const [isLiked, setIsLiked] = useState(post.userLiked)
  const [likesCount, setLikesCount] = useState(post.likesCount)
  const [isBookmarked, setIsBookmarked] = useState(post.userBookmarked)
  const [bookmarksCount, setBookmarksCount] = useState(post.bookmarksCount)
  const { user } = useAuthStore()
  const location = useLocation()
  const isOwner = user?.id === post.userId
  const likeMutation = useLikePostMutation()
  const bookmarkMutation = useBookmarkPostMutation()

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1)
    
    likeMutation.mutate(post.id, {
      onError: () => {
        setIsLiked(isLiked)
        setLikesCount(likesCount)
      }
    })
  }

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
    setBookmarksCount(prev => isBookmarked ? prev - 1 : prev + 1)
    
    bookmarkMutation.mutate(post.id, {
      onError: () => {
        setIsBookmarked(isBookmarked)
        setBookmarksCount(bookmarksCount)
      }
    })
  }

  const handleCopyLink = async () => {
    const postUrl = `${window.location.origin}/post/${post.id}`
    try {
      await navigator.clipboard.writeText(postUrl)
      toast.success('Link copied to clipboard!')
    } catch (error) {
      toast.error('Failed to copy link')
    }
  }

  const postUrl = `/post/${post.id}?return=${location.pathname}`

  return (
    <article
      className={cn(
        'relative p-4 transition-colors border-b border-border last:border-b-0 cursor-pointer',
        className
      )}
    >
      {!disableNavigation && (
        <Link 
          to={postUrl}
          className="absolute inset-0 z-0"
          aria-label={`View post by ${post.user.name}`}
        />
      )}
      <div className="flex items-center gap-3 mb-3 relative z-10 pointer-events-none">
        <Link 
          to={`/${post.user.username}`}
          className="flex-shrink-0 pointer-events-auto relative z-10"
        >
          <Avatar
            src={post.user.avatar || undefined}
            name={post.user.name}
            size="md"
          />
        </Link>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="flex flex-col min-w-0 w-fit">
              <div className="flex items-center gap-2">
                <Link 
                  to={`/${post.user.username}`}
                  className="font-semibold text-foreground truncate hover:underline pointer-events-auto relative z-10"
                >
                  {post.user.name}
                </Link>
                {post.user.isVerified && (
                  <BadgeCheck className="h-4 w-4 text-primary flex-shrink-0" />
                )}
                {!isPostView && (
                  <>
                    <span className="text-muted-foreground text-sm">·</span>
                    <span className="text-muted-foreground text-sm">
                      {formatPostDate(post.createdAt)}
                    </span>
                  </>
                )}
              </div>
              <Link 
                to={`/${post.user.username}`}
                className="text-muted-foreground text-sm truncate hover:underline pointer-events-auto relative z-10 w-fit"
              >
                @{post.user.username}
              </Link>
            </div>
            
            {!readOnly && (
              <div className="relative z-10 pointer-events-auto">
                <ResponsiveDropdown
                  trigger={
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0"
                    >
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  }
                  items={[
                    {
                      label: isBookmarked ? 'Remove Bookmark' : 'Bookmark',
                      icon: <Bookmark className="h-4 w-4" />,
                      onClick: handleBookmark,
                      variant: 'default' as const
                    },
                    ...(isOwner ? [
                      {
                        label: 'Edit',
                        icon: <Edit className="h-4 w-4" />,
                        onClick: () => setIsEditModalOpen(true),
                        variant: 'default' as const
                      },
                      {
                        label: 'Delete',
                        icon: <Trash2 className="h-4 w-4" />,
                        onClick: () => setIsDeleteModalOpen(true),
                        variant: 'destructive' as const
                      }
                    ] : [])
                  ]}
                  align="end"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {post.content && (
        <div className="mb-3 relative z-10 pointer-events-none">
          <p className="text-foreground whitespace-pre-wrap break-words">
            {post.content}
          </p>
        </div>
      )}

      {post.media && post.media.length > 0 && (
        <div className="mb-3 relative z-10 pointer-events-none">
          <PostMedia media={post.media} />
        </div>
      )}

      {isPostView && (
        <div className="mb-3 relative z-10 pointer-events-none">
          <p className="text-sm text-muted-foreground">
            {formatFullPostDate(post.createdAt)}
          </p>
        </div>
      )}

      <div className="flex items-center gap-6 text-muted-foreground text-sm relative z-10 pointer-events-none">
        <button 
          onClick={handleLike}
          disabled={likeMutation.isPending}
          className="flex items-center gap-1.5 hover:text-primary transition-colors disabled:opacity-50 cursor-pointer relative z-10 pointer-events-auto"
        >
          <Heart 
            className={cn(
              'h-5 w-5 transition-all',
              isLiked && 'fill-primary text-primary'
            )} 
          />
          <span>{likesCount}</span>
        </button>
        
        <button 
          onClick={setIsCommentModalOpen.bind(null, true)}
          className="flex items-center gap-1.5 hover:text-primary transition-colors cursor-pointer relative z-10 pointer-events-auto"
        >
          <MessageCircle className="h-5 w-5" />
          <span>{post.commentsCount}</span>
        </button>

        <div className="flex items-center gap-4 ml-auto">
          <div className="relative z-10 pointer-events-auto">
            <ResponsiveDropdown
              trigger={
                <button className="flex items-center gap-1.5 hover:text-primary transition-colors cursor-pointer">
                  <Share className="h-5 w-5" />
                </button>
              }
              items={[
                {
                  label: 'Copy Link',
                  icon: <LinkIcon className="h-4 w-4" />,
                  onClick: handleCopyLink,
                  variant: 'default' as const
                }
              ]}
              align="end"
            />
          </div>

          <button 
            onClick={handleBookmark}
            disabled={bookmarkMutation.isPending}
            className="flex items-center gap-1.5 hover:text-primary transition-colors disabled:opacity-50 cursor-pointer relative z-10 pointer-events-auto"
          >
            <Bookmark 
              className={cn(
                'h-5 w-5 transition-all',
                isBookmarked && 'fill-primary text-primary'
              )} 
            />
            {isPostView && <span>{bookmarksCount}</span>}
          </button>
        </div>
      </div>

      {isOwner && !readOnly && (
        <>
          <EditPost
            open={isEditModalOpen}
            onOpenChange={setIsEditModalOpen}
            post={post}
          />

          <DeletePost
            open={isDeleteModalOpen}
            onOpenChange={setIsDeleteModalOpen}
            post={post}
          />
        </>
      )}

      <CreateComment
        open={isCommentModalOpen}
        onOpenChange={setIsCommentModalOpen}
        postId={post.id}
      />
    </article>
  )
}
