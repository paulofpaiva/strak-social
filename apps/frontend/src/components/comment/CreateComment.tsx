import { useCallback } from 'react'
import { ResponsiveModal } from '@/components/ui/responsive-modal'
import { Button } from '@/components/ui/button'
import { CommentForm, useCommentFormValidation } from './CommentForm'

interface CreateCommentProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  postId: string
  parentCommentId?: string
}

export function CreateComment({ open, onOpenChange, postId, parentCommentId }: CreateCommentProps) {
  const { isValid, setIsValid } = useCommentFormValidation()
  
  const handleClose = useCallback(() => {
    onOpenChange(false)
  }, [onOpenChange])

  const actionButton = (
    <Button
      type="submit"
      form="create-comment-form"
      disabled={!isValid}
      className="flex-1"
    >
      {parentCommentId ? 'Reply' : 'Comment'}
    </Button>
  )

  return (
    <ResponsiveModal
      isOpen={open}
      onClose={handleClose}
      title={parentCommentId ? 'Reply to Comment' : 'Add Comment'}
      description={parentCommentId ? 'Share your thoughts on this comment' : 'Share your thoughts'}
      actionButton={actionButton}
    >
      <CommentForm
        mode="create"
        postId={postId}
        parentCommentId={parentCommentId}
        onSuccess={handleClose}
        submitButtonLabel={parentCommentId ? 'Reply' : 'Comment'}
        formId="create-comment-form"
        onValidationChange={setIsValid}
      />
    </ResponsiveModal>
  )
}

