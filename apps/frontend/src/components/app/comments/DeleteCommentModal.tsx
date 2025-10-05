import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { deleteCommentApi } from '@/api/posts'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/useToast'
import { useIsMobile } from '@/hooks/useIsMobile'
import { ResponsiveModal } from '@/components/ui/responsive-modal'
import { AlertTriangle } from 'lucide-react'

interface DeleteCommentModalProps {
  commentId: string
  postId: string
  isOpen: boolean
  onClose: () => void
  redirectToPost?: boolean
}

export function DeleteCommentModal({ commentId, postId, isOpen, onClose, redirectToPost = false }: DeleteCommentModalProps) {
  const { success, error: toastError } = useToast()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [isDeleting, setIsDeleting] = useState(false)
  const isMobile = useIsMobile()

  const deleteCommentMutation = useMutation({
    mutationFn: deleteCommentApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post-comments', postId] })
      queryClient.invalidateQueries({ queryKey: ['post', postId] })
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      queryClient.invalidateQueries({ queryKey: ['comment-replies'] })
      queryClient.invalidateQueries({ queryKey: ['comment'] })
      success('Comment deleted successfully')
      setIsDeleting(false)
      onClose()
      
      if (redirectToPost) {
        navigate(`/post/${postId}`)
      }
    },
    onError: (error: any) => {
      toastError(error.message || 'Failed to delete comment')
      setIsDeleting(false)
    }
  })

  const handleConfirmDelete = () => {
    setIsDeleting(true)
    deleteCommentMutation.mutate(commentId)
  }

  const handleCancel = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation()
    }
    if (!isDeleting) {
      onClose()
    }
  }

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={handleCancel}
      title="Delete Comment"
      description="This action cannot be undone."
      actionButton={
        <Button
          onClick={(e) => {
            e.stopPropagation()
            handleConfirmDelete()
          }}
          disabled={isDeleting}
          variant="destructive"
          className="min-w-20"
        >
          Delete
        </Button>
      }
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <AlertTriangle className="h-6 w-6 text-destructive" />
        </div>
        <div className="flex-1">
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete this comment? This action cannot be undone and will permanently remove the comment and all its content.
          </p>
        </div>
      </div>
      
      {!isMobile && (
        <div className="flex justify-end space-x-2 mt-6">
          <Button
            variant="outline"
            onClick={(e) => {
              e.stopPropagation()
              handleCancel()
            }}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            onClick={(e) => {
              e.stopPropagation()
              handleConfirmDelete()
            }}
            disabled={isDeleting}
            variant="destructive"
          >
            Delete
          </Button>
        </div>
      )}
    </ResponsiveModal>
  )
}
