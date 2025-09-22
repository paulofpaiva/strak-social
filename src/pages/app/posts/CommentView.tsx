import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Heart, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { formatDistanceToNow } from 'date-fns'
import { getCommentApi, likeCommentApi } from '@/api/posts'
import { useToast } from '@/hooks/useToast'
import { CommentActions } from '@/components/comments/CommentActions'
import { CommentReplies } from '@/components/comments/CommentReplies'
import { ImageModal } from '@/components/posts/ImageModal'
import { useState } from 'react'

export function CommentView() {
  const { commentId } = useParams<{ commentId: string }>()
  const navigate = useNavigate()
  const { error: toastError } = useToast()
  const queryClient = useQueryClient()
  const [showImageModal, setShowImageModal] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string>('')

  const {
    data: commentData,
    isLoading: commentLoading,
    error: commentError
  } = useQuery({
    queryKey: ['comment', commentId],
    queryFn: () => getCommentApi(commentId!),
    enabled: !!commentId,
  })

  const likeCommentMutation = useMutation({
    mutationFn: likeCommentApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comment', commentId] })
      queryClient.invalidateQueries({ queryKey: ['comment-replies', commentId] })
    },
    onError: (error: any) => {
      toastError(error.message || 'Failed to like comment')
    }
  })

  const handleImageClick = (imageUrl: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedImage(imageUrl)
    setShowImageModal(true)
  }

  const handleCloseImageModal = () => {
    setShowImageModal(false)
    setSelectedImage('')
  }

  const handleLikeComment = (commentId: string) => {
    likeCommentMutation.mutate(commentId)
  }

  const handleBackToPost = () => {
    if (commentData?.comment) {
      if (commentData.comment.parentCommentId) {
        navigate(`/comment/${commentData.comment.parentCommentId}`)
      } 
      else if (commentData.comment.postId) {
        navigate(`/post/${commentData.comment.postId}`)
      } 
      else {
        navigate('/dashboard')
      }
    } else {
      navigate('/dashboard')
    }
  }

  const getBackButtonText = () => {
    if (commentData?.comment) {
      return commentData.comment.parentCommentId ? 'Back to Comment' : 'Back to Post'
    }
    return 'Back to Post'
  }

  if (commentLoading) {
    return (
      <>
        <div className="flex items-center space-x-4 mb-6">
          <div className="h-8 w-8 bg-muted rounded animate-pulse"></div>
          <div className="h-6 w-16 bg-muted rounded animate-pulse"></div>
        </div>
        <div className="max-w-2xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="border border-border rounded-lg p-4">
              <div className="flex space-x-3">
                <div className="w-10 h-10 bg-muted rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-muted rounded mb-2 w-1/3"></div>
                  <div className="h-4 bg-muted rounded w-2/3"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  if (commentError || !commentData?.comment) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Comment not found</h2>
          <p className="text-muted-foreground mb-4">The comment you're looking for doesn't exist or has been removed.</p>
          <Button onClick={handleBackToPost}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {getBackButtonText()}
          </Button>
        </div>
      </div>
    )
  }

  const comment = commentData.comment

  return (
    <>
      <div className="flex items-center space-x-4 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBackToPost}
          className="h-8 w-8 p-0"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-xl font-semibold text-foreground">Comment</h1>
      </div>

      <div className="max-w-2xl mx-auto px-4">

      <div className="border border-border rounded-lg p-4 mb-6">
        <div className="flex space-x-3">
          <Avatar
            src={comment.user.avatar || undefined}
            name={comment.user.name}
            className="w-10 h-10"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <div className="hidden sm:flex items-center justify-between">
                  <h4 className="font-semibold text-foreground text-sm">
                    {comment.user.name}
                  </h4>
                  <span className="text-muted-foreground text-xs ml-2 flex-shrink-0">
                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                  </span>
                </div>
                
                <div className="sm:hidden">
                  <h4 className="font-semibold text-foreground text-sm">
                    {comment.user.name}
                  </h4>
                </div>
                
                <div className="flex items-center space-x-2">
                  <p className="text-muted-foreground text-xs">
                    @{comment.user.username}
                  </p>
                  <span className="text-muted-foreground text-xs sm:hidden">·</span>
                  <span className="text-muted-foreground text-xs sm:hidden">
                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                  </span>
                </div>
              </div>
              <CommentActions comment={comment} postId={comment.postId} redirectToPostOnDelete={true} />
            </div>
            <p className="text-foreground text-sm whitespace-pre-wrap mb-3">
              {comment.content}
            </p>
            
            {comment.media && comment.media.length > 0 && (
              <div className="mb-3">
                {comment.media.length === 1 ? (
                  <img
                    src={comment.media[0].mediaUrl}
                    alt="Comment media"
                    className="w-full max-w-xs rounded-lg border border-border cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={(e) => handleImageClick(comment.media![0].mediaUrl, e)}
                  />
                ) : (
                  <div className="grid grid-cols-2 gap-2 max-w-xs">
                    {comment.media.slice(0, 4).map((media, index) => (
                      <div key={media.id} className="relative">
                        {media.mediaType === 'image' && (
                          <img
                            src={media.mediaUrl}
                            alt={`Comment media ${index + 1}`}
                            className="w-full h-20 object-cover rounded-lg border border-border cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={(e) => handleImageClick(media.mediaUrl, e)}
                          />
                        )}
                        {media.mediaType === 'video' && (
                          <video
                            src={media.mediaUrl}
                            controls
                            className="w-full h-20 object-cover rounded-lg border border-border"
                          />
                        )}
                        {media.mediaType === 'gif' && (
                          <img
                            src={media.mediaUrl}
                            alt="GIF"
                            className="w-full h-20 object-cover rounded-lg border border-border cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={(e) => handleImageClick(media.mediaUrl, e)}
                          />
                        )}
                        {comment.media && comment.media.length > 4 && index === 3 && (
                          <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">
                              +{comment.media.length - 4}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center space-x-4 mt-2">
              <Button
                variant="ghost"
                size="sm"
                className={`h-8 px-2 ${comment.userLiked ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'}`}
                onClick={() => handleLikeComment(comment.id)}
                disabled={likeCommentMutation.isPending}
              >
                <Heart className={`h-4 w-4 mr-1 ${comment.userLiked ? 'fill-current' : ''}`} />
                <span className="text-xs">{comment.likesCount || 0}</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-muted-foreground hover:text-foreground"
              >
                <MessageCircle className="h-4 w-4 mr-1" />
                <span className="text-xs">{comment.repliesCount || 0}</span>
              </Button>
            </div>

          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-border">
          <CommentReplies commentId={comment.id} postId={comment.postId} />
        </div>
      </div>

      </div>

      {showImageModal && (
        <ImageModal
          imageUrl={selectedImage}
          isOpen={showImageModal}
          onClose={handleCloseImageModal}
        />
      )}
    </>
  )
}
