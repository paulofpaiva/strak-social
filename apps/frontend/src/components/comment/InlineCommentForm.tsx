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
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { commentFieldMax, type CreateCommentFormData } from '@/schemas/comment'
import { cn } from '@/lib/utils'
import { useCommentForm, useCommentMutation } from '@/hooks/comment'
import { useMediaManager } from '@/hooks/post'
import type { MediaFile } from '@/hooks/post/types'
import { SortableMediaItem } from '../post/SortableMediaItem'
import { useAuthStore } from '@/stores/authStore'

interface InlineCommentFormProps {
  postId: string
  parentCommentId?: string
  placeholder?: string
  onSuccess?: () => void
}

export function InlineCommentForm({ 
  postId,
  parentCommentId,
  placeholder = "Post your reply",
  onSuccess
}: InlineCommentFormProps) {
  const { user } = useAuthStore()
  const form = useCommentForm({ defaultContent: '' })
  const media = useMediaManager({ 
    maxFiles: commentFieldMax.mediaFiles,
    initialMedia: []
  })
  
  const mutation = useCommentMutation({
    type: 'create',
    postId,
    parentCommentId,
    onSuccess: () => {
      form.reset()
      media.reset()
      onSuccess?.()
    },
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

  const onSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    const data = {
      content: form.getValues('content'),
      mediaFiles: media.mediaFiles,
    }
    mutation.mutate(data)
  }, [form, mutation, media.mediaFiles])

  const isSubmitDisabled = !form.isContentValid || mutation.isPending

  if (!user) {
    return null
  }

  return (
    <div className="p-4">
      <form onSubmit={onSubmit} className="space-y-3">
        <div className="flex gap-3">
          <Avatar
            src={user.avatar || undefined}
            name={user.name}
            size="sm"
            className="flex-shrink-0 mt-1"
          />
          
          <div className="flex-1 min-w-0">
            <Textarea
              placeholder={placeholder}
              value={form.watch('content')}
              onChange={(e) => form.setValue('content', e.target.value)}
              className={cn(
                "min-h-[60px] resize-none border-0 px-3 py-2 text-base placeholder:text-muted-foreground focus-visible:ring-0",
                form.formState.errors.content && 'border-destructive focus-visible:border-destructive'
              )}
              rows={1}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement
                target.style.height = 'auto'
                target.style.height = target.scrollHeight + 'px'
              }}
            />
            
            <div className="flex justify-between items-center mt-2">
              <div className="flex items-center gap-2">
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
                  variant="ghost"
                  size="sm"
                  onClick={() => media.fileInputRef.current?.click()}
                  disabled={!media.canAddMore}
                  className="h-8 w-8 p-0 rounded-full hover:bg-primary/10"
                >
                  <Image className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex items-center gap-3">
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
                <Button
                  type="submit"
                  disabled={isSubmitDisabled}
                  className="rounded-full px-4 h-8 text-sm"
                >
                  Reply
                </Button>
              </div>
            </div>
          </div>
        </div>

        {media.hasMedia && (
          <div className="ml-11">
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
          </div>
        )}
      </form>
    </div>
  )
}
