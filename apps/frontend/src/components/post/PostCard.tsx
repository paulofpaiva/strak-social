import { cn } from '@/lib/utils'
import { Avatar } from '@/components/ui/avatar'
import { PostMedia } from './PostMedia'
import { MediaViewer } from '@/components/MediaViewer'
import { formatPostDate, formatFullPostDate } from '@/utils/date'
import type { Post } from '@/api/posts'
import { Heart, MessageCircle, MoreVertical, Trash2, Edit, BadgeCheck, Bookmark, Share, Link as LinkIcon, NotebookText } from 'lucide-react'
import { ResponsiveDropdown } from '@/components/ui/responsive-dropdown'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/authStore'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { EditPost } from './EditPost'
import { DeletePost } from './DeletePost'
import { CreateComment } from '@/components/comment/CreateComment'
import { SaveToListsModal } from '@/components/list/SaveToListsModal'
import { useLikePostMutation, useBookmarkPostMutation } from '@/hooks/post'
import { useNavigationState } from '@/hooks/useNavigationState'
import { removePostFromListApi } from '@/api/lists'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

interface PostCardProps {
  post: Post
  className?: string
  readOnly?: boolean
  disableNavigation?: boolean
  isPostView?: boolean
  listContext?: {
    listId: string
    isOwner: boolean
  }
}

export function PostCard({ post, className, readOnly = false, disableNavigation = false, isPostView = false, listContext }: PostCardProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false)
  const [isSaveToListsModalOpen, setIsSaveToListsModalOpen] = useState(false)
  const [isMediaViewerOpen, setIsMediaViewerOpen] = useState(false)
  const [mediaViewerIndex, setMediaViewerIndex] = useState(0)
  const [isLiked, setIsLiked] = useState(post.userLiked)
  const [likesCount, setLikesCount] = useState(post.likesCount)
  const [isBookmarked, setIsBookmarked] = useState(post.userBookmarked)
  const [bookmarksCount, setBookmarksCount] = useState(post.bookmarksCount)
  const { user } = useAuthStore()
  const { navigateWithReturn } = useNavigationState()
  const queryClient = useQueryClient()
  const isOwner = user?.id === post.userId
  const likeMutation = useLikePostMutation()
  const bookmarkMutation = useBookmarkPostMutation()

  const removeFromListMutation = useMutation({
    mutationFn: ({ listId, postId }: { listId: string, postId: string }) => 
      removePostFromListApi(listId, postId),
    onSuccess: () => {
      toast.success('Post removed from list')
      if (listContext) {
        queryClient.invalidateQueries({ queryKey: ['listPosts', listContext.listId] })
        queryClient.invalidateQueries({ queryKey: ['list', listContext.listId] })
        queryClient.invalidateQueries({ queryKey: ['postLists', post.id] })
        queryClient.invalidateQueries({ queryKey: ['lists'] })
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to remove post from list')
    },
  })

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

  const handleRemoveFromList = () => {
    if (listContext) {
      removeFromListMutation.mutate({
        listId: listContext.listId,
        postId: post.id
      })
    }
  }

  const handleMediaClick = (index: number) => {
    setMediaViewerIndex(index)
    setIsMediaViewerOpen(true)
  }

  const handlePostClick = () => {
    if (!disableNavigation) {
      navigateWithReturn(`/post/${post.id}`)
    }
  }

  return (
    <article
      className={cn(
        'relative p-4 transition-colors border-b border-border last:border-b-0 cursor-pointer',
        className
      )}
    >
      {!disableNavigation && (
        <div 
          onClick={handlePostClick}
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
                    {
                      label: 'Add/Remove from Lists',
                      icon: <NotebookText className="h-4 w-4" />,
                      onClick: () => setIsSaveToListsModalOpen(true),
                      variant: 'default' as const
                    },
                    ...(listContext?.isOwner ? [
                      {
                        label: 'Remove from List',
                        icon: <Trash2 className="h-4 w-4" />,
                        onClick: handleRemoveFromList,
                        variant: 'destructive' as const
                      }
                    ] : []),
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
        <div className={cn(
          'mb-3 relative z-10',
          isPostView ? 'pointer-events-auto' : 'pointer-events-none'
        )}>
          <PostMedia 
            media={post.media} 
            isPostView={isPostView}
            onMediaClick={isPostView ? handleMediaClick : undefined}
          />
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

      {post.media && post.media.length > 0 && (
        <MediaViewer
          media={post.media}
          initialIndex={mediaViewerIndex}
          isOpen={isMediaViewerOpen}
          onClose={() => setIsMediaViewerOpen(false)}
        />
      )}

      <SaveToListsModal
        isOpen={isSaveToListsModalOpen}
        onClose={() => setIsSaveToListsModalOpen(false)}
        postId={post.id}
      />
    </article>
  )
}
