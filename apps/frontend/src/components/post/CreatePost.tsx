import { useCallback } from 'react'
import { ResponsiveModal } from '@/components/ui/responsive-modal'
import { Button } from '@/components/ui/button'
import { PostForm, usePostFormValidation } from './PostForm'

interface CreatePostProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreatePost({ open, onOpenChange }: CreatePostProps) {
  const { isValid, setIsValid } = usePostFormValidation()
  
  const handleClose = useCallback(() => {
    onOpenChange(false)
  }, [onOpenChange])

  const actionButton = (
    <Button
      type="submit"
      form="create-post-form"
      disabled={!isValid}
      className="flex-1"
    >
      Post
    </Button>
  )

  return (
    <ResponsiveModal
      isOpen={open}
      onClose={handleClose}
      title="Create Post"
      description="Share what's on your mind"
      actionButton={actionButton}
    >
      <PostForm
        mode="create"
        onSuccess={handleClose}
        submitButtonLabel="Post"
        formId="create-post-form"
        onValidationChange={setIsValid}
      />
    </ResponsiveModal>
  )
}