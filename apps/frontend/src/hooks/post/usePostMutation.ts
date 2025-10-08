import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createPostApi, updatePostApi, toggleLikePostApi } from '@/api/posts'
import type { MediaFile, MediaOrder } from './types'

type MutationType = 'create' | 'update'

interface UsePostMutationOptions {
  type: MutationType
  postId?: string
  onSuccess?: () => void
}

interface MutationData {
  content: string
  mediaFiles: MediaFile[]
}

export function usePostMutation(options: UsePostMutationOptions) {
  const { type, postId, onSuccess } = options
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async ({ content, mediaFiles }: MutationData) => {
      if (type === 'create') {
        const orderedFiles = mediaFiles
          .filter(mf => mf.file !== null)
          .map(mf => mf.file!)
        return createPostApi(content, orderedFiles)
      } else {
        const newFiles = mediaFiles
          .filter(m => m.file !== null)
          .map(m => m.file!)
        
        const mediaOrder: MediaOrder[] = mediaFiles.map(m => ({
          id: m.id,
          isExisting: !!m.isExisting
        }))
        
        if (!postId) {
          throw new Error('postId is required for update mutation')
        }
        
        return updatePostApi(postId, content, newFiles, mediaOrder)
      }
    },
    onSuccess: () => {
      const message = type === 'create' 
        ? 'Post created successfully!' 
        : 'Post updated successfully!'
      toast.success(message)
      
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      queryClient.invalidateQueries({ queryKey: ['user-posts'] })
      
      onSuccess?.()
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message 
        || error.message 
        || `Failed to ${type} post`
      toast.error(errorMessage)
    },
  })

  return mutation
}

export function useLikePostMutation() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (postId: string) => {
      return toggleLikePostApi(postId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      queryClient.invalidateQueries({ queryKey: ['user-posts'] })
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message 
        || error.message 
        || 'Failed to like post'
      toast.error(errorMessage)
    },
  })

  return mutation
}

