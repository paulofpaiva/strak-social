import { useState, useRef, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Image, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable'
import { ResponsiveModal } from '@/components/ui/responsive-modal'
import { FloatingTextarea } from '@/components/ui/floating-textarea'
import { Button } from '@/components/ui/button'
import { 
  createPostSchema, 
  createPostFieldMax, 
  validateMediaFile,
  type CreatePostFormData 
} from '@/schemas/post'
import { createPostApi } from '@/api/posts'
import { cn } from '@/lib/utils'
import { SortableMediaItem } from './SortableMediaItem'

interface CreatePostProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface MediaFile {
  id: string
  file: File
  preview: string
}

export function CreatePost({ open, onOpenChange }: CreatePostProps) {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<CreatePostFormData>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      content: '',
    },
  })

  const content = watch('content')
  const contentLength = content?.length || 0

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

  const createPostMutation = useMutation({
    mutationFn: async (data: CreatePostFormData) => {
      const orderedFiles = mediaFiles.map(mf => mf.file)
      return createPostApi(data.content, orderedFiles)
    },
    onSuccess: () => {
      toast.success('Post created successfully!')
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      handleClose()
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create post'
      toast.error(errorMessage)
    },
  })

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    
    if (files.length === 0) return

    if (mediaFiles.length + files.length > createPostFieldMax.mediaFiles) {
      toast.error(`You can add up to ${createPostFieldMax.mediaFiles} files`)
      return
    }

    const validFiles: MediaFile[] = []
    
    for (const file of files) {
      const validation = validateMediaFile(file)
      
      if (!validation.success) {
        toast.error(validation.error!)
        continue
      }

      validFiles.push({
        id: `${Date.now()}-${Math.random()}`,
        file,
        preview: URL.createObjectURL(file),
      })
    }

    setMediaFiles(prev => [...prev, ...validFiles])
    
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleRemoveMedia = (id: string) => {
    setMediaFiles(prev => {
      const mediaToRemove = prev.find(m => m.id === id)
      if (mediaToRemove) {
        URL.revokeObjectURL(mediaToRemove.preview)
      }
      return prev.filter(m => m.id !== id)
    })
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    
    if (over && active.id !== over.id) {
      setMediaFiles((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id)
        const newIndex = items.findIndex(item => item.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  const handleClose = () => {
    mediaFiles.forEach(media => {
      URL.revokeObjectURL(media.preview)
    })
    setMediaFiles([])
    reset()
    onOpenChange(false)
  }

  const onSubmit = (data: CreatePostFormData) => {
    createPostMutation.mutate(data)
  }

  useEffect(() => {
    return () => {
      mediaFiles.forEach(media => {
        URL.revokeObjectURL(media.preview)
      })
    }
  }, [])

  const isFormValid = contentLength > 0 && contentLength <= createPostFieldMax.content
  const isSubmitDisabled = !isFormValid || createPostMutation.isPending

  const actionButton = (
    <Button
      onClick={handleSubmit(onSubmit)}
      disabled={isSubmitDisabled}
      className="flex-1"
    >
      Post
    </Button>
  )

  return (
    <ResponsiveModal
      isOpen={open}
      onClose={handleClose}
      title="Create Post"
      actionButton={actionButton}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="relative">
          <FloatingTextarea
            label="What's happening?"
            rows={4}
            {...register('content')}
            className={cn(
              errors.content && 'border-destructive focus-visible:border-destructive'
            )}
          />
          <div className="flex justify-between items-center mt-1">
            <div className="text-xs text-muted-foreground">
              {errors.content && (
                <span className="text-destructive">{errors.content.message}</span>
              )}
            </div>
            <div className={cn(
              "text-xs font-medium",
              contentLength > createPostFieldMax.content 
                ? "text-destructive" 
                : contentLength > createPostFieldMax.content * 0.9
                  ? "text-orange-500"
                  : "text-muted-foreground"
            )}>
              {contentLength}/{createPostFieldMax.content}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              disabled={mediaFiles.length >= createPostFieldMax.mediaFiles}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={mediaFiles.length >= createPostFieldMax.mediaFiles}
              className="rounded-full h-10 w-10 p-0"
            >
              <Image className="h-5 w-5" />
            </Button>
          </div>

          {mediaFiles.length > 0 && (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={mediaFiles.map(m => m.id)}
                strategy={horizontalListSortingStrategy}
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {mediaFiles.map((media) => (
                    <SortableMediaItem
                      key={media.id}
                      id={media.id}
                      file={media.file}
                      preview={media.preview}
                      onRemove={() => handleRemoveMedia(media.id)}
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