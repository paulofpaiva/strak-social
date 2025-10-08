import { cn } from '@/lib/utils'
import { Avatar } from '@/components/ui/avatar'
import { PostMedia } from './PostMedia'
import { formatPostDate } from '@/utils/date'
import type { Post } from '@/api/posts'
import { Heart, MessageCircle, MoreVertical, Trash2 } from 'lucide-react'
import { ResponsiveDropdown } from '@/components/ui/responsive-dropdown'
import { ResponsiveModal } from '@/components/ui/responsive-modal'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/authStore'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deletePostApi } from '@/api/posts'
import { useState } from 'react'
import { toast } from 'sonner'

interface PostCardProps {
  post: Post
  className?: string
}

export function PostCard({ post, className }: PostCardProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const { user } = useAuthStore()
  const queryClient = useQueryClient()
  const isOwner = user?.id === post.userId

  const deletePostMutation = useMutation({
    mutationFn: deletePostApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-posts'] })
      setIsDeleteModalOpen(false)
      toast.success('Post deleted successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete post')
    }
  })

  const handleDeletePost = () => {
    deletePostMutation.mutate(post.id)
  }

  return (
    <article
      className={cn(
        'bg-card p-4 hover:bg-accent/50 transition-colors border-b border-border last:border-b-0',
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
            
            {isOwner && (
              <ResponsiveDropdown
                trigger={
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                }
                items={[
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
        <div className="flex items-center gap-1.5">
          <Heart 
            className={cn(
              'h-5 w-5',
              post.userLiked && 'fill-red-500 text-red-500'
            )} 
          />
          <span>{post.likesCount}</span>
        </div>
        
        <div className="flex items-center gap-1.5">
          <MessageCircle className="h-5 w-5" />
          <span>{post.commentsCount}</span>
        </div>
      </div>

      <ResponsiveModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete post?"
        description="This action cannot be undone."
        onCancel={() => setIsDeleteModalOpen(false)}
        cancelText="Cancel"
        actionButton={
          <Button
            variant="destructive"
            onClick={handleDeletePost}
            disabled={deletePostMutation.isPending}
            className="flex-1"
          >
            Delete
          </Button>
        }
      >
        <p className="text-sm text-muted-foreground">
          Are you sure you want to delete this post? This action is permanent and cannot be undone.
        </p>
      </ResponsiveModal>
    </article>
  )
}
