import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { ResponsiveModal } from "@/components/ui/responsive-modal"
import { DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useIsMobile } from "@/hooks/useIsMobile"
import { useToastContext } from "@/contexts/ToastContext"
import { createCommentApi, type CreateCommentMedia } from "@/api/posts"
import { ImageUpload } from "@/components/app/posts/ImageUpload"

const replySchema = z.object({
  content: z.string()
    .min(1, 'Reply content is required')
    .max(280, 'Reply must have at most 280 characters'),
})

type ReplyFormData = z.infer<typeof replySchema>

interface CreateCommentModalProps {
  isOpen: boolean
  onClose: () => void
  parentCommentId: string
  postId: string
}

export function CreateCommentModal({ isOpen, onClose, parentCommentId, postId }: CreateCommentModalProps) {
  const { success: toastSuccess, error: toastError } = useToastContext()
  const isMobile = useIsMobile()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [images, setImages] = useState<string[]>([])
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
    reset,
    clearErrors
  } = useForm<ReplyFormData>({
    resolver: zodResolver(replySchema),
    defaultValues: {
      content: "",
    },
    mode: "onChange"
  })

  const content = watch("content")

  const createReplyMutation = useMutation({
    mutationFn: ({ postId, data }: { postId: string, data: any }) => createCommentApi(postId, data),
    onSuccess: () => {
      toastSuccess('Reply posted successfully!')
      reset()
      setImages([])
      clearErrors()
      onClose()
      
      queryClient.invalidateQueries({ queryKey: ['comments', postId] })
      queryClient.invalidateQueries({ queryKey: ['comment-replies', parentCommentId] })
      queryClient.invalidateQueries({ queryKey: ['comment', parentCommentId] })
      
      navigate(`/post/${postId}/comment/${parentCommentId}`)
    },
    onError: (error: any) => {
      toastError(error.message || 'Error posting reply')
    },
    onSettled: () => {
      setIsSubmitting(false)
    }
  })

  const onSubmit = async (data: ReplyFormData) => {
    if (isSubmitting) return

    setIsSubmitting(true)

    try {
      const mediaData: CreateCommentMedia[] = images.map((image, index) => ({
        mediaUrl: image,
        mediaType: 'image' as const,
        order: index + 1
      }))

      await createReplyMutation.mutateAsync({
        postId,
        data: {
          content: data.content,
          parentCommentId,
          media: mediaData.length > 0 ? mediaData : undefined
        }
      })
    } catch (error) {
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      reset()
      setImages([])
      clearErrors()
      onClose()
    }
  }

  const handleImageChange = (newImages: string[]) => {
    setImages(newImages)
  }

  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Reply"
      description="Share your thoughts"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Textarea
            {...register("content")}
            placeholder="What's your reply?"
            className="min-h-[100px] resize-none border-0 p-0 text-base focus-visible:ring-0 focus-visible:ring-offset-0"
            onClick={(e) => e.stopPropagation()}
          />
          {errors.content && (
            <p className="text-sm text-destructive">{errors.content.message}</p>
          )}
        </div>

        {images.length > 0 && (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              {images.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image}
                    alt={`Reply image ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg border border-border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemoveImage(index)
                    }}
                  >
                    ×
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        <ImageUpload
          images={images}
          onImagesChange={handleImageChange}
          maxImages={4}
        />

        <div className="flex items-center justify-between pt-4">
          <div className="text-sm text-muted-foreground">
            {content.length}/280
          </div>
          
          {!isMobile && (
            <DialogFooter className="p-0">
              <Button
                type="button"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation()
                  handleClose()
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!isValid || isSubmitting || content.trim() === ""}
                onClick={(e) => e.stopPropagation()}
              >
                {isSubmitting ? (
                  <>
                    Post
                  </>
                ) : (
                  'Reply'
                )}
              </Button>
            </DialogFooter>
          )}
        </div>
      </form>

      {isMobile && (
        <div className="sticky bottom-0 left-0 right-0 bg-background border-t p-4 mt-4">
          <Button
            type="submit"
            form="reply-form"
            className="w-full"
            disabled={!isValid || isSubmitting || content.trim() === ""}
            onClick={(e) => e.stopPropagation()}
          >
            {isSubmitting ? (
              <>
                Post
              </>
            ) : (
              'Reply'
            )}
          </Button>
        </div>
      )}
    </ResponsiveModal>
  )
}
