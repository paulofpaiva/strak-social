import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { ResponsiveModal } from "@/components/ui/responsive-modal"
import { DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useIsMobile } from "@/hooks/useIsMobile"
import { useToastContext } from "@/contexts/ToastContext"
import { createPostApi } from "@/api/posts"
import { Loader2 } from "lucide-react"

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
      
      await createPostApi({
        content: data.content
      })
      
      toastSuccess("Post created successfully!")
      reset()
      onClose()
    } catch (error: any) {
      toastError(error.message || "Error creating post")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    reset()
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
      {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
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
          <Textarea
            id="content"
            {...register("content")}
            placeholder="What's happening?"
            rows={4}
            className="resize-none"
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
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            Post
          </Button>
        </DialogFooter>
      )}
    </ResponsiveModal>
  )
}
