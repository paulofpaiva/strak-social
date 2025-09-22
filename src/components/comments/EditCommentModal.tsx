import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/useToast'
import { useIsMobile } from '@/hooks/useIsMobile'
import { ResponsiveModal } from '@/components/ui/responsive-modal'
import { updateCommentApi, type Comment } from '@/api/posts'
import { Image, X } from 'lucide-react'

const editCommentSchema = z.object({
  content: z.string()
    .min(1, 'Comment content is required')
    .max(280, 'Comment must have at most 280 characters'),
})

type EditCommentFormData = z.infer<typeof editCommentSchema>

interface EditCommentModalProps {
  comment: Comment
  isOpen: boolean
  onClose: () => void
}

export function EditCommentModal({ comment, isOpen, onClose }: EditCommentModalProps) {
  const { success: toastSuccess, error: toastError } = useToast()
  const queryClient = useQueryClient()
  const isMobile = useIsMobile()
  const [images, setImages] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    clearErrors,
    watch
  } = useForm<EditCommentFormData>({
    resolver: zodResolver(editCommentSchema),
    defaultValues: {
      content: comment.content,
    },
    mode: "onChange"
  })

  const watchedContent = watch("content")

  // Initialize images from comment media
  useEffect(() => {
    if (comment.media && comment.media.length > 0) {
      setImages(comment.media.map(media => media.mediaUrl))
    }
  }, [comment.media])

  const updateCommentMutation = useMutation({
    mutationFn: (data: EditCommentFormData) => updateCommentApi(comment.id, {
      content: data.content,
      media: images.length > 0 ? images.map((image, index) => ({
        mediaUrl: image,
        mediaType: 'image' as const,
        order: index
      })) : undefined
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post-comments', comment.postId] })
      queryClient.invalidateQueries({ queryKey: ['post', comment.postId] })
      queryClient.invalidateQueries({ queryKey: ['comment', comment.id] })
      queryClient.invalidateQueries({ queryKey: ['comment-replies'] })
      toastSuccess("Comment updated successfully!")
      handleClose()
    },
    onError: (error: any) => {
      toastError(error.message || "Error updating comment")
    }
  })

  const onSubmit = async (data: EditCommentFormData) => {
    setIsSubmitting(true)
    try {
      await updateCommentMutation.mutateAsync(data)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    reset()
    setImages([])
    clearErrors()
    onClose()
  }

  const handleCancel = () => {
    if (!isSubmitting) {
      handleClose()
    }
  }

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={handleCancel}
      title="Edit Comment"
      description="Update your comment"
      actionButton={
        <Button
          onClick={(e) => {
            e.stopPropagation()
            handleSubmit(onSubmit)()
          }}
          disabled={!isValid || isSubmitting || (watchedContent?.trim().length === 0 && images.length === 0)}
          className="min-w-20"
        >
          Update
        </Button>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Textarea
            {...register("content")}
            placeholder="What's happening?"
            className="min-h-[100px]"
            rows={4}
            onClick={(e) => e.stopPropagation()}
          />
          {errors.content && (
            <p className="text-sm text-destructive mt-1">{errors.content.message}</p>
          )}
        </div>

        <div className="space-y-3">
          {images.length > 0 && (
            <div>
              <div className="grid grid-cols-2 gap-2 max-w-xs">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-20 object-cover rounded-lg border border-border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-1 right-1 h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation()
                        setImages(images.filter((_, i) => i !== index))
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {images.length < 3 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-muted-foreground hover:text-primary"
              onClick={(e) => {
                e.stopPropagation()
                const input = document.createElement('input')
                input.type = 'file'
                input.accept = 'image/*'
                input.multiple = true
                input.onchange = (e) => {
                  const files = (e.target as HTMLInputElement).files
                  if (files && files.length > 0) {
                    const newImages = Array.from(files).slice(0, 3 - images.length)
                    newImages.forEach(file => {
                      const reader = new FileReader()
                      reader.onload = (e) => {
                        const result = e.target?.result as string
                        if (result) {
                          setImages(prev => [...prev, result])
                        }
                      }
                      reader.readAsDataURL(file)
                    })
                  }
                }
                input.click()
              }}
            >
              <Image className="h-4 w-4" />
            </Button>
          )}
        </div>

        {!isMobile && (
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation()
                handleCancel()
              }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={(e) => e.stopPropagation()}
              disabled={!isValid || isSubmitting || (watchedContent?.trim().length === 0 && images.length === 0)}
            >
              Update
            </Button>
          </div>
        )}
      </form>
    </ResponsiveModal>
  )
}
