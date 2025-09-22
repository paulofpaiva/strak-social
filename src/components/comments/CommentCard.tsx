import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { formatDistanceToNow } from 'date-fns'
import { Heart, Reply, MessageCircle } from 'lucide-react'
import { likeCommentApi, type Comment } from '@/api/posts'
import { useToast } from '@/hooks/useToast'
import { CommentActions } from './CommentActions'
import { ImageModal } from '../posts/ImageModal'
import { CreateCommentModal } from './CreateCommentModal'

interface CommentCardProps {
  comment: Comment
  postId: string
  showReplyButton?: boolean
  isReply?: boolean
}

export function CommentCard({ 
  comment, 
  postId, 
  showReplyButton = true,
  isReply = false
}: CommentCardProps) {
  const [showImageModal, setShowImageModal] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string>('')
  const [showReplyModal, setShowReplyModal] = useState(false)
  const { error: toastError } = useToast()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const likeCommentMutation = useMutation({
    mutationFn: likeCommentApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post-comments', postId] })
      queryClient.invalidateQueries({ queryKey: ['comment-replies', comment.id] })
      queryClient.invalidateQueries({ queryKey: ['comment', comment.id] })
      if (comment.parentCommentId) {
        queryClient.invalidateQueries({ queryKey: ['comment-replies', comment.parentCommentId] })
      }
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

  const handleViewComment = (commentId: string) => {
    navigate(`/post/${postId}/comment/${commentId}`)
  }

  const handleReplyClick = () => {
    setShowReplyModal(true)
  }

  return (
    <>
      <div 
        className={`flex space-x-3 ${isReply ? 'p-4 cursor-pointer hover:bg-muted/50 transition-colors rounded-lg' : 'p-4 cursor-pointer hover:bg-muted/50 transition-colors rounded-lg'}`}
        onClick={() => handleViewComment(comment.id)}
      >
        <Avatar
          src={comment.user.avatar || undefined}
          name={comment.user.name}
          className="w-8 h-8"
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
            <CommentActions comment={comment} postId={postId} />
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
              onClick={(e) => {
                e.stopPropagation()
                handleLikeComment(comment.id)
              }}
              disabled={likeCommentMutation.isPending}
            >
              <Heart className={`h-4 w-4 mr-1 ${comment.userLiked ? 'fill-current' : ''}`} />
              <span className="text-xs">{comment.likesCount || 0}</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-muted-foreground hover:text-foreground"
              onClick={(e) => {
                e.stopPropagation()
                handleViewComment(comment.id)
              }}
            >
              <MessageCircle className="h-4 w-4 mr-1" />
              <span className="text-xs">{comment.repliesCount || 0}</span>
            </Button>
             {showReplyButton && (
               <Button
                 variant="ghost"
                 size="sm"
                 className="h-8 px-2 text-muted-foreground hover:text-foreground"
                 onClick={(e) => {
                   e.stopPropagation()
                   handleReplyClick()
                 }}
               >
                 <Reply className="h-4 w-4 mr-1" />
                 <span className="text-xs">
                   {comment.repliesCount && comment.repliesCount > 0 ? comment.repliesCount : 'Reply'}
                 </span>
               </Button>
             )}
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

      {showReplyModal && (
        <CreateCommentModal
          isOpen={showReplyModal}
          onClose={() => setShowReplyModal(false)}
          parentCommentId={comment.id}
          postId={postId}
        />
      )}
    </>
  )
}
