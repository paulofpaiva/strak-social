import { useCallback } from 'react'
import { ResponsiveModal } from '@/components/ui/responsive-modal'
import { Button } from '@/components/ui/button'
import { CommentForm, useCommentFormValidation } from './CommentForm'
import type { Comment } from '@/api/comments'
import type { MediaFile } from '@/hooks/post/types'

interface EditCommentProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  comment: Comment
}

export function EditComment({ open, onOpenChange, comment }: EditCommentProps) {
  const { isValid, setIsValid } = useCommentFormValidation()
  
  const handleClose = useCallback(() => {
    onOpenChange(false)
  }, [onOpenChange])

  const initialMedia: MediaFile[] = comment.media.map(m => ({
    id: m.id,
    file: null,
    preview: m.mediaUrl,
    isExisting: true,
    mediaType: m.mediaType === 'gif' ? 'image' : m.mediaType,
  }))

  const actionButton = (
    <Button
      type="submit"
      form="edit-comment-form"
      disabled={!isValid}
      className="flex-1"
      onClick={(e) => e.stopPropagation()}
    >
      Update
    </Button>
  )

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <ResponsiveModal
        isOpen={open}
        onClose={handleClose}
        title="Edit Comment"
        description="Update your comment"
        actionButton={actionButton}
      >
        <CommentForm
          mode="update"
          commentId={comment.id}
          postId={comment.postId}
          initialContent={comment.content}
          initialMedia={initialMedia}
          onSuccess={handleClose}
          submitButtonLabel="Update"
          formId="edit-comment-form"
          onValidationChange={setIsValid}
        />
      </ResponsiveModal>
    </div>
  )
}

