import { ResponsiveModal } from '@/components/ui/responsive-modal'
import { Button } from '@/components/ui/button'
import { useDeleteCommentMutation } from '@/hooks/comment'
import { useNavigate, useLocation } from 'react-router-dom'
import type { Comment } from '@/api/comments'

interface DeleteCommentProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  comment: Comment
  onDeleteSuccess?: () => void
}

export function DeleteComment({ open, onOpenChange, comment, onDeleteSuccess }: DeleteCommentProps) {
  const deleteMutation = useDeleteCommentMutation()
  const navigate = useNavigate()
  const location = useLocation()

  const handleDelete = () => {
    deleteMutation.mutate(
      { 
        commentId: comment.id, 
        postId: comment.postId,
        parentCommentId: comment.parentCommentId || undefined
      },
      {
        onSuccess: () => {
          onOpenChange(false)
          
          if (location.pathname === `/comment/${comment.id}`) {
            const searchParams = new URLSearchParams(location.search)
            const returnUrl = searchParams.get('return')
            
            if (comment.parentCommentId) {
              navigate(`/comment/${comment.parentCommentId}${location.search}`)
            } 
            else if (returnUrl) {
              navigate(returnUrl)
            } 
            else {
              navigate('/feed')
            }
          }
          
          onDeleteSuccess?.()
        }
      }
    )
  }

  const actionButton = (
    <Button
      variant="destructive"
      onClick={(e) => {
        e.stopPropagation()
        handleDelete()
      }}
      disabled={deleteMutation.isPending}
      className="flex-1"
    >
      {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
    </Button>
  )

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <ResponsiveModal
        isOpen={open}
        onClose={() => onOpenChange(false)}
        title="Delete comment?"
        description="This action cannot be undone."
        onCancel={() => onOpenChange(false)}
        cancelText="Cancel"
        actionButton={actionButton}
      >
        <p className="text-sm text-muted-foreground">
          Are you sure you want to delete this comment? This action is permanent and cannot be undone.
        </p>
      </ResponsiveModal>
    </div>
  )
}

