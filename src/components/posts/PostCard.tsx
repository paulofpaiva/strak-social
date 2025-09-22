import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { likePostApi } from '@/api/posts'
import { Avatar } from '@/components/ui/avatar'
import { Heart, MessageCircle, Share, Trash2, MoreHorizontal, Edit } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks'
import { useToast } from '@/hooks/useToast'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { DeletePostModal } from '@/components/posts/DeletePostModal'
import { EditPostModal } from './EditPostModal'
import { ImageModal } from './ImageModal'
import { PostComments } from './PostComments'
import { CreateCommentModal } from '../comments/CreateCommentModal'
import { formatTimeAgo } from '@/utils/formatting'

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
}

export function PostCard({ 
  post, 
  className, 
  showComments = false,
  onPostDeleted,
  disableHover = false
}: PostCardProps) {
  const { user: currentUser } = useAuth()
  const { error: toastError } = useToast()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showImageModal, setShowImageModal] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string>('')
  const [showCreateCommentModal, setShowCreateCommentModal] = useState(false)


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

  const handleDeletePost = () => {
    setShowDeleteModal(true)
  }

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false)
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

  const isMyPost = currentUser && currentUser.id === post.userId

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
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                  <h3 className="font-semibold text-foreground overflow-hidden text-ellipsis whitespace-nowrap">
                    {post.user.name}
                  </h3>
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <span className="overflow-hidden text-ellipsis whitespace-nowrap">@{post.user.username}</span>
                    <span>·</span>
                    <span className="whitespace-nowrap">{formatTimeAgo(post.createdAt)}</span>
                  </div>
                </div>
              </div>
              
              {isMyPost && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation()
                        setShowEditModal(true)
                      }}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeletePost()
                      }}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
            
            <p className="text-foreground mb-3 whitespace-pre-wrap">
              {post.content}
            </p>

            {post.media && post.media.length > 0 && (
              <div className="mb-3">
                {post.media.length === 1 ? (
                  <img
                    src={post.media[0].mediaUrl}
                    alt="Post media"
                    className="w-full max-w-md rounded-lg border border-border cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={(e) => handleImageClick(post.media![0].mediaUrl, e)}
                  />
                ) : (
                  <div className="grid grid-cols-2 gap-2 max-w-md">
                    {post.media.slice(0, 4).map((media, index) => (
                      <div key={index} className="relative">
                        <img
                          src={media.mediaUrl}
                          alt={`Post media ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border border-border cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={(e) => handleImageClick(media.mediaUrl, e)}
                        />
                        {post.media && post.media.length > 4 && index === 3 && (
                          <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                            <span className="text-white font-semibold">
                              +{post.media.length - 4}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
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
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 px-2"
                onClick={(e) => e.stopPropagation()}
              >
                <Share className="h-4 w-4 mr-1" />
                <span className="text-sm">Share</span>
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

      {showDeleteModal && (
        <DeletePostModal
          postId={post.id}
          isOpen={showDeleteModal}
          onClose={handleCloseDeleteModal}
          onDeleteSuccess={onPostDeleted}
        />
      )}

      {showEditModal && (
        <EditPostModal
          post={post as any}
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
        />
      )}

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
    </>
  )
}
