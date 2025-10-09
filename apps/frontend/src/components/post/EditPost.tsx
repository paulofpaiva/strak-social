import { useCallback, useMemo } from 'react'
import { ResponsiveModal } from '@/components/ui/responsive-modal'
import { Button } from '@/components/ui/button'
import type { Post } from '@/api/posts'
import type { MediaFile } from '@/hooks/post'
import { PostForm, usePostFormValidation } from './PostForm'

interface EditPostProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  post: Post
}

export function EditPost({ open, onOpenChange, post }: EditPostProps) {
  const { isValid, setIsValid } = usePostFormValidation()
  
  const handleClose = useCallback(() => {
    onOpenChange(false)
  }, [onOpenChange])

  const initialMedia = useMemo(() => {
    if (post.media && post.media.length > 0) {
      return post.media.map(m => ({
        id: m.id,
        file: null,
        preview: m.mediaUrl,
        isExisting: true,
        mediaType: m.mediaType
      })) as MediaFile[]
    }
    return []
  }, [post.media])

  const actionButton = (
    <Button
      type="submit"
      form="edit-post-form"
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
        title="Edit Post"
        description="Update your post content and media"
        actionButton={actionButton}
      >
        <PostForm
          mode="update"
          postId={post.id}
          initialContent={post.content}
          initialMedia={initialMedia}
          onSuccess={handleClose}
          submitButtonLabel="Update"
          formId="edit-post-form"
          key={open ? post.id : 'closed'}
          onValidationChange={setIsValid}
        />
      </ResponsiveModal>
    </div>
  )
}
