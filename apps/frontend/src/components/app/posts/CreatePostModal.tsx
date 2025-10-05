import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useQueryClient } from "@tanstack/react-query"
import { ResponsiveModal } from "@/components/ui/responsive-modal"
import { DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useIsMobile } from "@/hooks/useIsMobile"
import { useToastContext } from "@/contexts/ToastContext"
import { createPostApi, type CreatePostMedia } from "@/api/posts"
import { ImageUpload } from "@/components/app/posts/ImageUpload"

const createPostSchema = z.object({
  content: z.string()
    .min(1, 'Post content is required')
    .max(280, 'Post must have at most 280 characters'),
})

type CreatePostFormData = z.infer<typeof createPostSchema>

interface CreatePostModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CreatePostModal({ isOpen, onClose }: CreatePostModalProps) {
  const { success: toastSuccess, error: toastError } = useToastContext()
  const isMobile = useIsMobile()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [images, setImages] = useState<string[]>([])
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
    reset,
    clearErrors
  } = useForm<CreatePostFormData>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      content: "",
    },
    mode: "onChange"
  })

  const watchedContent = watch("content")

  const onSubmit = async (data: CreatePostFormData) => {
    try {
      setIsSubmitting(true)
      
      const media: CreatePostMedia[] = images.map((image, index) => ({
        mediaUrl: image,
        mediaType: 'image' as const,
        order: index
      }))
      
      await createPostApi({
        content: data.content,
        media: media.length > 0 ? media : undefined
      })
      
      await queryClient.invalidateQueries({ queryKey: ['posts'] })
      await queryClient.invalidateQueries({ queryKey: ['user-posts'] })
      
      toastSuccess("Post created successfully!")
      reset()
      setImages([])
      onClose()
    } catch (error: any) {
      toastError(error.message || "Error creating post")
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

  const actionButton = isMobile ? (
    <Button 
      type="submit" 
      form="create-post-form" 
      disabled={isSubmitting || !isValid}
      className="w-full"
    >
      Post
    </Button>
  ) : undefined

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create Post"
      description="Share your thoughts with the world."
      actionButton={actionButton}
    >
      <form id="create-post-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <div className="space-y-2">
            <Textarea
              id="content"
              {...register("content")}
              placeholder="What's happening?"
              rows={4}
              className="min-h-[100px]"
              maxLength={280}
              autoFocus
            />
            <div className="flex justify-between items-center">
              {errors.content && (
                <p className="text-sm text-destructive">{errors.content.message}</p>
              )}
              <p className={`text-sm ml-auto ${(watchedContent?.length || 0) > 260 ? 'text-destructive' : 'text-muted-foreground'}`}>
                {(watchedContent?.length || 0)}/280
              </p>
            </div>
          </div>
          <ImageUpload
            images={images}
            onImagesChange={setImages}
            maxImages={3}
          />
        </div>
      </form>

      {!isMobile && (
        <DialogFooter className="mt-6">
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            form="create-post-form" 
            disabled={isSubmitting || !isValid}
          >
            Post
          </Button>
        </DialogFooter>
      )}
    </ResponsiveModal>
  )
}
