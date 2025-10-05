import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Heart, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { format } from 'date-fns'
import { getCommentApi, likeCommentApi } from '@/api/posts'
import { useToast } from '@/hooks/useToast'
import { CommentActions } from '@/components/app/comments/CommentActions'
import { CommentReplies } from '@/components/app/comments/CommentReplies'
import { CommentLoadingSkeleton } from '@/components/app/comments/CommentLoadingSkeleton'
import { MediaGrid } from '@/components/ui/media-grid'
import { ImageModal } from '@/components/app/posts/ImageModal'
import { useState } from 'react'

export function CommentView() {
  const { id, postId } = useParams<{ id: string; postId: string }>()
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
    queryKey: ['comment', id],
    queryFn: () => getCommentApi(id!),
    enabled: !!id,
  })

  const likeCommentMutation = useMutation({
    mutationFn: likeCommentApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comment', id] })
      queryClient.invalidateQueries({ queryKey: ['comment-replies', id] })
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
    if (postId) {
      navigate(`/post/${postId}`)
    } else if (commentData?.comment?.postId) {
      navigate(`/post/${commentData.comment.postId}`)
    } else {
      navigate('/feed')
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
          <CommentLoadingSkeleton count={1} />
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

      <div className="max-w-2xl mx-auto">
        <div className="w-full py-4 pr-4 mb-6">
          <div className="flex space-x-3">
            <Avatar
              src={comment.user.avatar || undefined}
              name={comment.user.name}
              className="w-10 h-10"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                    <h3 className="font-semibold text-foreground overflow-hidden text-ellipsis whitespace-nowrap">
                      {comment.user.name}
                    </h3>
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <span className="overflow-hidden text-ellipsis whitespace-nowrap">@{comment.user.username}</span>
                      <span>·</span>
                      <span className="whitespace-nowrap">{format(new Date(comment.createdAt), 'HH:mm')}</span>
                    </div>
                  </div>
                </div>
                <CommentActions comment={comment} postId={comment.postId} redirectToPostOnDelete={true} />
              </div>
              
              <p className="text-foreground text-sm whitespace-pre-wrap mb-3">
                {comment.content}
              </p>
              
              <MediaGrid 
                media={comment.media || []}
                onImageClick={handleImageClick}
                maxWidth="xs"
              />

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

export default CommentView