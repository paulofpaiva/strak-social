import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { ResponsiveModal } from "@/components/ui/responsive-modal"
import { DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useIsMobile } from "@/hooks/useIsMobile"
import { useToastContext } from "@/contexts/ToastContext"
import { updatePostApi, type Post } from "@/api/posts"
import { ImageUpload } from "@/components/app/posts/ImageUpload"

const editPostSchema = z.object({
  content: z.string()
    .min(1, 'Post content is required')
    .max(280, 'Post must have at most 280 characters'),
})

type EditPostFormData = z.infer<typeof editPostSchema>

interface EditPostModalProps {
  isOpen: boolean
  onClose: () => void
  post: Post
}

export function EditPostModal({ isOpen, onClose, post }: EditPostModalProps) {
  const { success: toastSuccess, error: toastError } = useToastContext()
  const isMobile = useIsMobile()
  const [images, setImages] = useState<string[]>([])
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
    reset,
    clearErrors
  } = useForm<EditPostFormData>({
    resolver: zodResolver(editPostSchema),
    defaultValues: {
      content: post.content,
    },
    mode: "onChange"
  })

  const watchedContent = watch("content")

  useEffect(() => {
    if (post.media && post.media.length > 0) {
      const existingImages = post.media
        .filter(media => media.mediaType === 'image')
        .sort((a, b) => a.order - b.order)
        .map(media => media.mediaUrl)
      setImages(existingImages)
    }
  }, [post])

  const updatePostMutation = useMutation({
    mutationFn: (data: EditPostFormData) => updatePostApi(post.id, {
      content: data.content,
      media: images.length > 0 ? images.map((image, index) => ({
        mediaUrl: image,
        mediaType: 'image' as const,
        order: index
      })) : undefined
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      queryClient.invalidateQueries({ queryKey: ['user-posts'] })
      queryClient.invalidateQueries({ queryKey: ['post', post.id] })
      toastSuccess("Post updated successfully!")
      handleClose()
    },
    onError: (error: any) => {
      toastError(error.message || "Error updating post")
    }
  })

  const onSubmit = async (data: EditPostFormData) => {
    updatePostMutation.mutate(data)
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
      form="edit-post-form" 
      disabled={updatePostMutation.isPending || !isValid}
      className="w-full"
    >
      Update
    </Button>
  ) : undefined

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Edit Post"
      description="Update your post content and media"
      actionButton={actionButton}
    >
      <form id="edit-post-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Textarea
            {...register("content")}
            placeholder="What's happening?"
            className="min-h-[120px]"
            maxLength={280}
          />
          {errors.content && (
            <p className="text-sm text-destructive">{errors.content.message}</p>
          )}
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{watchedContent?.length || 0}/280 characters</span>
          </div>
        </div>

        <div className="space-y-4">
          <ImageUpload
            images={images}
            onImagesChange={setImages}
            maxImages={4}
          />
        </div>

        {!isMobile && (
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={updatePostMutation.isPending || !isValid}
            >
              Update
            </Button>
          </DialogFooter>
        )}
      </form>
    </ResponsiveModal>
  )
}
