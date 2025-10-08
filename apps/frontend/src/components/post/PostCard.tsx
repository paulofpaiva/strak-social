import { cn } from '@/lib/utils'
import { Avatar } from '@/components/ui/avatar'
import { PostMedia } from './PostMedia'
import { formatPostDate } from '@/utils/date'
import type { Post } from '@/api/posts'
import { Heart, MessageCircle, MoreVertical, Trash2, Edit } from 'lucide-react'
import { ResponsiveDropdown } from '@/components/ui/responsive-dropdown'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/authStore'
import { useState } from 'react'
import { EditPost } from './EditPost'
import { DeletePost } from './DeletePost'
import { useLikePostMutation } from '@/hooks/post'

interface PostCardProps {
  post: Post
  className?: string
  readOnly?: boolean
}

export function PostCard({ post, className, readOnly = false }: PostCardProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isLiked, setIsLiked] = useState(post.userLiked)
  const [likesCount, setLikesCount] = useState(post.likesCount)
  const { user } = useAuthStore()
  const isOwner = user?.id === post.userId
  const likeMutation = useLikePostMutation()

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

  return (
    <article
      className={cn(
        'p-4 transition-colors border-b border-border last:border-b-0',
        className
      )}
    >
      <div className="flex items-start gap-3 mb-3">
        <Avatar
          src={post.user.avatar || undefined}
          name={post.user.name}
          size="md"
          className="flex-shrink-0"
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="flex-1 flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground truncate">
                  {post.user.name}
                </span>
                <span className="text-muted-foreground text-sm">·</span>
                <span className="text-muted-foreground text-sm">
                  {formatPostDate(post.createdAt)}
                </span>
              </div>
              <span className="text-muted-foreground text-sm truncate">
                @{post.user.username}
              </span>
            </div>
            
            {isOwner && !readOnly && (
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
            )}
          </div>
        </div>
      </div>

      {post.content && (
        <div className="mb-3">
          <p className="text-foreground whitespace-pre-wrap break-words">
            {post.content}
          </p>
        </div>
      )}

      {post.media && post.media.length > 0 && (
        <div className="mb-3">
          <PostMedia media={post.media} />
        </div>
      )}

      <div className="flex items-center gap-6 text-muted-foreground text-sm">
        <button 
          onClick={handleLike}
          disabled={likeMutation.isPending}
          className="flex items-center gap-1.5 hover:text-red-500 transition-colors disabled:opacity-50 cursor-pointer"
        >
          <Heart 
            className={cn(
              'h-5 w-5 transition-all',
              isLiked && 'fill-red-500 text-red-500'
            )} 
          />
          <span>{likesCount}</span>
        </button>
        
        <div className="flex items-center gap-1.5">
          <MessageCircle className="h-5 w-5" />
          <span>{post.commentsCount}</span>
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
    </article>
  )
}
