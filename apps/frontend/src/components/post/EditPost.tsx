import { useEffect, useCallback } from 'react'
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
import { ResponsiveModal } from '@/components/ui/responsive-modal'
import { FloatingTextarea } from '@/components/ui/floating-textarea'
import { Button } from '@/components/ui/button'
import { createPostFieldMax, type CreatePostFormData } from '@/schemas/post'
import type { Post } from '@/api/posts'
import { cn } from '@/lib/utils'
import { useMediaManager, usePostForm, usePostMutation, type MediaFile } from '@/hooks/post'
import { SortableMediaItem } from './SortableMediaItem'

interface EditPostProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  post: Post
}

export function EditPost({ open, onOpenChange, post }: EditPostProps) {
  const form = usePostForm({ defaultContent: post.content })
  const media = useMediaManager({ maxFiles: createPostFieldMax.mediaFiles })
  
  const handleClose = useCallback(() => {
    media.cleanup()
    form.reset()
    onOpenChange(false)
  }, [media, form, onOpenChange])
  
  const mutation = usePostMutation({
    type: 'update',
    postId: post.id,
    onSuccess: handleClose,
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

  useEffect(() => {
    if (open) {
      form.reset({ content: post.content })
      
      if (post.media && post.media.length > 0) {
        const existingMedia: MediaFile[] = post.media.map(m => ({
          id: m.id,
          file: null,
          preview: m.mediaUrl,
          isExisting: true,
          mediaType: m.mediaType
        }))
        media.reset(existingMedia)
      } else {
        media.reset([])
      }
    }
  }, [open, post])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    media.addFiles(files)
  }

  const onSubmit = (data: CreatePostFormData) => {
    mutation.mutate({
      content: data.content,
      mediaFiles: media.mediaFiles,
    })
  }

  const isSubmitDisabled = !form.isContentValid || mutation.isPending

  const actionButton = (
    <Button
      onClick={form.handleSubmit(onSubmit)}
      disabled={isSubmitDisabled}
      className="flex-1"
    >
      Update
    </Button>
  )

  return (
    <ResponsiveModal
      isOpen={open}
      onClose={handleClose}
      title="Edit Post"
      actionButton={actionButton}
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="relative">
          <FloatingTextarea
            label="What's happening?"
            rows={4}
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
      </form>
    </ResponsiveModal>
  )
}
