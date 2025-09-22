import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar } from '@/components/ui/avatar'
import { useAuth } from '@/hooks'
import { useToast } from '@/hooks/useToast'
import { createCommentApi } from '@/api/posts'
import { Image, X } from 'lucide-react'

const commentSchema = z.object({
  content: z.string()
    .min(1, 'Comment content is required')
    .max(280, 'Comment must have at most 280 characters'),
})

type CommentFormData = z.infer<typeof commentSchema>

interface CommentFormProps {
  postId: string
  parentCommentId?: string
  onCommentAdded?: () => void
  isReplyForm?: boolean
}

export function CommentForm({ postId, parentCommentId, onCommentAdded, isReplyForm = false }: CommentFormProps) {
  const { user } = useAuth()
  const { success: toastSuccess, error: toastError } = useToast()
  const queryClient = useQueryClient()
  const [images, setImages] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
    reset,
    clearErrors
  } = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      content: "",
    },
    mode: "onChange"
  })

  const watchedContent = watch("content")

  const createCommentMutation = useMutation({
    mutationFn: (data: CommentFormData) => createCommentApi(postId, {
      content: data.content,
      parentCommentId: parentCommentId,
      media: images.length > 0 ? images.map((image, index) => ({
        mediaUrl: image,
        mediaType: 'image' as const,
        order: index
      })) : undefined
    }),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['post-comments', postId] })
      queryClient.invalidateQueries({ queryKey: ['post', postId] })
      if (parentCommentId) {
        queryClient.invalidateQueries({ queryKey: ['comment-replies', parentCommentId] })
        queryClient.invalidateQueries({ queryKey: ['comment', parentCommentId] })
        if (response?.comments?.[0]?.id) {
          queryClient.invalidateQueries({ queryKey: ['comment-replies', response.comments[0].id] })
        }
      }
      toastSuccess("Comment added successfully!")
      reset()
      setImages([])
      clearErrors()
      onCommentAdded?.()
    },
    onError: (error: any) => {
      toastError(error.message || "Error creating comment")
    }
  })

  const onSubmit = async (data: CommentFormData) => {
    setIsSubmitting(true)
    try {
      await createCommentMutation.mutateAsync(data)
    } finally {
      setIsSubmitting(false)
    }
  }


  if (!user) return null

  return (
    <div className={`${isReplyForm ? 'p-4' : 'border-b border-border p-4'}`}>
      <div className="flex space-x-3">
        <Avatar
          src={user.avatar || undefined}
          name={user.name}
          className="w-10 h-10"
        />
        <div className="flex-1">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <Textarea
              {...register("content")}
              placeholder="Post your reply"
              className="min-h-[60px]"
              rows={3}
            />
            
            {errors.content && (
              <p className="text-sm text-destructive">{errors.content.message}</p>
            )}

            {images.length > 0 && (
              <div className="mt-3">
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
                        onClick={() => setImages(images.filter((_, i) => i !== index))}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-primary"
                  onClick={() => {
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
               
              </div>

              <Button
                type="submit"
                disabled={!isValid || isSubmitting || (watchedContent?.trim().length === 0 && images.length === 0)}
                className="px-6"
              >
                Reply
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
