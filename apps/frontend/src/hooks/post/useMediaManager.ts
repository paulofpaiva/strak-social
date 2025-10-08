import { useState, useCallback, useRef, useEffect } from 'react'
import { toast } from 'sonner'
import { DragEndEvent } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { validateMediaFile, createPostFieldMax } from '@/schemas/post'
import type { MediaFile } from './types'

interface UseMediaManagerOptions {
  maxFiles?: number
  initialMedia?: MediaFile[]
}

export function useMediaManager(options: UseMediaManagerOptions = {}) {
  const { maxFiles = createPostFieldMax.mediaFiles, initialMedia = [] } = options
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>(initialMedia)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const addFiles = useCallback((files: File[]) => {
    if (files.length === 0) return

    if (mediaFiles.length + files.length > maxFiles) {
      toast.error(`You can add up to ${maxFiles} files`)
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
  }, [mediaFiles.length, maxFiles])

  const removeFile = useCallback((id: string) => {
    setMediaFiles(prev => {
      const mediaToRemove = prev.find(m => m.id === id)
      if (mediaToRemove && !mediaToRemove.isExisting && mediaToRemove.preview) {
        URL.revokeObjectURL(mediaToRemove.preview)
      }
      return prev.filter(m => m.id !== id)
    })
  }, [])

  const reorderFiles = useCallback((event: DragEndEvent) => {
    const { active, over } = event
    
    if (over && active.id !== over.id) {
      setMediaFiles((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id)
        const newIndex = items.findIndex(item => item.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }, [])

  const cleanup = useCallback(() => {
    mediaFiles.forEach(media => {
      if (!media.isExisting && media.preview) {
        URL.revokeObjectURL(media.preview)
      }
    })
    setMediaFiles([])
  }, [mediaFiles])

  const reset = useCallback((newMedia: MediaFile[] = []) => {
    mediaFiles.forEach(media => {
      if (!media.isExisting && media.preview) {
        URL.revokeObjectURL(media.preview)
      }
    })
    setMediaFiles(newMedia)
  }, [mediaFiles])

  useEffect(() => {
    return () => {
      mediaFiles.forEach(media => {
        if (!media.isExisting && media.preview) {
          URL.revokeObjectURL(media.preview)
        }
      })
    }
  }, [])

  return {
    mediaFiles,
    fileInputRef,
    addFiles,
    removeFile,
    reorderFiles,
    cleanup,
    reset,
    canAddMore: mediaFiles.length < maxFiles,
    hasMedia: mediaFiles.length > 0,
  }
}

