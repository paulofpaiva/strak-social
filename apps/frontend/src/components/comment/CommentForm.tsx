import { useCallback, useEffect, useState } from 'react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable'
import { Image } from 'lucide-react'
import { FloatingTextarea } from '@/components/ui/floating-textarea'
import { Button } from '@/components/ui/button'
import { commentFieldMax, type CreateCommentFormData } from '@/schemas/comment'
import { cn } from '@/lib/utils'
import { useCommentForm, useCommentMutation } from '@/hooks/comment'
import { useMediaManager } from '@/hooks/post'
import type { MediaFile } from '@/hooks/post/types'
import { SortableMediaItem } from '../post/SortableMediaItem'

interface CommentFormProps {
  mode: 'create' | 'update'
  commentId?: string
  postId: string
  parentCommentId?: string
  initialContent?: string
  initialMedia?: MediaFile[]
  onSuccess?: () => void
  submitButtonLabel?: string
  formId?: string
  onValidationChange?: (isValid: boolean) => void
}

export function useCommentFormValidation() {
  const [isValid, setIsValid] = useState(false)
  return { isValid, setIsValid }
}

export function CommentForm({ 
  mode, 
  commentId,
  postId,
  parentCommentId,
  initialContent = '',
  initialMedia = [],
  onSuccess,
  submitButtonLabel,
  formId = 'comment-form',
  onValidationChange
}: CommentFormProps) {
  const form = useCommentForm({ defaultContent: initialContent })
  const media = useMediaManager({ 
    maxFiles: commentFieldMax.mediaFiles,
    initialMedia
  })
  
  const mutation = useCommentMutation({
    type: mode,
    commentId,
    postId,
    parentCommentId,
    onSuccess,
  })

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    })
  )

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    media.addFiles(files)
  }, [media])

  const onSubmit = useCallback((data: CreateCommentFormData) => {
    mutation.mutate({
      content: data.content,
      mediaFiles: media.mediaFiles,
    })
  }, [mutation, media.mediaFiles])

  const isSubmitDisabled = !form.isContentValid || mutation.isPending
  const isValid = form.isContentValid && !mutation.isPending

  useEffect(() => {
    if (onValidationChange) {
      onValidationChange(isValid)
    }
  }, [isValid, onValidationChange])

  return (
    <form id={formId} onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="relative">
        <FloatingTextarea
          label="Write your comment..."
          rows={3}
          {...form.register('content')}
          className={cn(
            form.formState.errors.content && 'border-destructive focus-visible:border-destructive'
          )}
        />
        <div className="flex justify-between items-center mt-1">
          <div className="text-xs text-muted-foreground">
            {form.formState.errors.content && (
              <span className="text-destructive">{form.formState.errors.content.message}</span>
            )}
          </div>
          <div className={cn(
            "text-xs font-medium",
            form.contentLength > form.maxContentLength
              ? "text-destructive" 
              : form.contentLength > form.maxContentLength * 0.9
                ? "text-orange-500"
                : "text-muted-foreground"
          )}>
            {form.contentLength}/{form.maxContentLength}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <input
            ref={media.fileInputRef}
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            disabled={!media.canAddMore}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => media.fileInputRef.current?.click()}
            disabled={!media.canAddMore}
            className="rounded-full h-10 w-10 p-0"
          >
            <Image className="h-5 w-5" />
          </Button>
        </div>

        {media.hasMedia && (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={media.reorderFiles}
          >
            <SortableContext
              items={media.mediaFiles.map(m => m.id)}
              strategy={horizontalListSortingStrategy}
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {media.mediaFiles.map((mediaItem) => (
                  <SortableMediaItem
                    key={mediaItem.id}
                    id={mediaItem.id}
                    file={mediaItem.file}
                    preview={mediaItem.preview}
                    onRemove={() => media.removeFile(mediaItem.id)}
                    mediaType={mediaItem.mediaType}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>

      {!onValidationChange && (
        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            disabled={isSubmitDisabled}
            className="min-w-[100px]"
          >
            {submitButtonLabel || (mode === 'create' ? 'Comment' : 'Update')}
          </Button>
        </div>
      )}
    </form>
  )
}

