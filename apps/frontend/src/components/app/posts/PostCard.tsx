import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { likePostApi } from '@/api/posts'
import { Avatar } from '@/components/ui/avatar'
import { Heart, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/useToast'
import { PostActions } from './PostActions'
import { MediaGrid } from '@/components/ui/media-grid'
import { ImageModal } from './ImageModal'
import { PostComments } from './PostComments'
import { CreateCommentModal } from '../comments/CreateCommentModal'
import { EditPostModal } from './EditPostModal'
import { DeletePostModal } from './DeletePostModal'
import { formatTimeAgo } from '@/utils/formatting'
import { format } from 'date-fns'

interface PostCardProps {
  post: {
    id: string
    userId: string
    content: string
    createdAt: string
    updatedAt: string
    user: {
      id: string
      name: string
      username: string
      avatar: string | null
    }
    media?: Array<{
      id: string
      mediaUrl: string
      mediaType: string
      order: number
    }>
    likesCount: number
    userLiked: boolean
    commentsCount?: number
  }
  className?: string
  showComments?: boolean
  onPostDeleted?: () => void
  disableHover?: boolean
  showDetailedTimestamp?: boolean
}

export function PostCard({ 
  post, 
  className, 
  showComments = false,
  onPostDeleted,
  disableHover = false,
  showDetailedTimestamp = false
}: PostCardProps) {
  const { error: toastError } = useToast()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [showImageModal, setShowImageModal] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string>('')
  const [showCreateCommentModal, setShowCreateCommentModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)


  const likePostMutation = useMutation({
    mutationFn: likePostApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-posts'] })
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      queryClient.invalidateQueries({ queryKey: ['post', post.id] })
    },
    onError: (error: any) => {
      toastError(error.message || 'Failed to like post')
    }
  })

  const handleLikePost = () => {
    likePostMutation.mutate(post.id)
  }

  const handlePostClick = () => {
    navigate(`/post/${post.id}`)
  }

  const handleImageClick = (imageUrl: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedImage(imageUrl)
    setShowImageModal(true)
  }

  const handleCloseImageModal = () => {
    setShowImageModal(false)
    setSelectedImage('')
  }

  const handleEditPost = () => {
    setShowEditModal(true)
  }

  const handleDeletePost = () => {
    setShowDeleteModal(true)
  }

  const handleCloseEditModal = () => {
    setShowEditModal(false)
  }

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false)
  }

  const isEdited = post.updatedAt !== post.createdAt

  return (
    <>
      <div 
        className={`w-full py-4 pr-4 ${disableHover ? '' : 'cursor-pointer'} ${className}`}
        onClick={disableHover ? undefined : handlePostClick}
      >
        <div className="flex space-x-3">
          <Avatar
            src={post.user.avatar || undefined}
            name={post.user.name}
            className="w-10 h-10"
          />
          <div className="flex-1 min-w-0">
            <div className="grid grid-cols-[1fr_auto] gap-3 items-start mb-2">
              <div className="min-w-0 overflow-hidden">
                <div className={`flex ${showDetailedTimestamp ? 'flex-col' : 'flex-col sm:flex-row sm:items-center sm:gap-2'}`}>
                  <h3 className="font-semibold text-foreground truncate">
                    {post.user.name}
                  </h3>
                  <div className="flex items-center gap-2 text-muted-foreground text-sm min-w-0">
                    <span className="truncate">@{post.user.username}</span>
                    {!showDetailedTimestamp && (
                      <>
                        <span>·</span>
                        <span className="whitespace-nowrap">{formatTimeAgo(post.createdAt)}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="shrink-0">
                <PostActions 
                  post={post} 
                  onEditPost={handleEditPost}
                  onDeletePost={handleDeletePost}
                />
              </div>
            </div>
            
            <p className="text-foreground mb-3 whitespace-pre-wrap">
              {post.content}
            </p>

            <MediaGrid 
              media={post.media || []}
              onImageClick={handleImageClick}
              maxWidth="md"
            />

            {showDetailedTimestamp && (
              <div className="mb-3">
                <p className="text-muted-foreground text-sm">
                  {format(new Date(post.createdAt), 'HH:mm · MMM d, yyyy')}
                  {isEdited && (
                    <>
                      <span className="mx-2">·</span>
                      <span>Edited</span>
                    </>
                  )}
                </p>
              </div>
            )}

            <div className="flex items-center space-x-6 text-muted-foreground">
              <Button 
                variant="ghost" 
                size="sm" 
                className={`h-8 px-2 ${post.userLiked ? 'text-red-500 hover:text-red-600' : 'hover:text-red-500'}`}
                onClick={(e) => {
                  e.stopPropagation()
                  handleLikePost()
                }}
                disabled={likePostMutation.isPending}
              >
                <Heart className={`h-4 w-4 mr-1 ${post.userLiked ? 'fill-current' : ''}`} />
                <span className="text-sm">{post.likesCount || 0}</span>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 px-2 text-muted-foreground hover:text-foreground"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowCreateCommentModal(true)
                }}
              >
                <MessageCircle className="h-4 w-4 mr-1" />
                <span className="text-sm">{post.commentsCount || 0}</span>
              </Button>
            </div>
          </div>
        </div>

        {showComments && (
          <div className="mt-4 pt-4 border-t border-border">
            <PostComments postId={post.id} />
          </div>
        )}
      </div>

      {showImageModal && (
        <ImageModal
          imageUrl={selectedImage}
          isOpen={showImageModal}
          onClose={handleCloseImageModal}
        />
      )}

      {showCreateCommentModal && (
        <CreateCommentModal
          isOpen={showCreateCommentModal}
          onClose={() => setShowCreateCommentModal(false)}
          postId={post.id}
          redirectTo="post"
        />
      )}

      {showEditModal && (
        <EditPostModal
          post={post as any}
          isOpen={showEditModal}
          onClose={handleCloseEditModal}
        />
      )}

      {showDeleteModal && (
        <DeletePostModal
          postId={post.id}
          isOpen={showDeleteModal}
          onClose={handleCloseDeleteModal}
          onDeleteSuccess={onPostDeleted}
        />
      )}
    </>
  )
}
