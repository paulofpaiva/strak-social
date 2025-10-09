import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createPostApi, updatePostApi, toggleLikePostApi, toggleBookmarkPostApi } from '@/api/posts'
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
    onSuccess: async () => {
      const message = type === 'create' 
        ? 'Post created successfully!' 
        : 'Post updated successfully!'
      toast.success(message)
      
      await queryClient.invalidateQueries({ 
        queryKey: ['user-posts'],
        refetchType: 'active'
      })
      
      await queryClient.invalidateQueries({ 
        queryKey: ['posts'],
        refetchType: 'active'
      })
      
      await queryClient.invalidateQueries({ 
        queryKey: ['following-posts'],
        refetchType: 'active'
      })
      
      await queryClient.invalidateQueries({ 
        queryKey: ['bookmarks'],
        refetchType: 'active'
      })
      
      if (postId) {
        await queryClient.invalidateQueries({ 
          queryKey: ['post', postId],
          refetchType: 'active'
        })
      }
      
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
    onSuccess: async (_data, postId) => {
      await queryClient.invalidateQueries({ 
        queryKey: ['posts'],
        refetchType: 'all'
      })
      await queryClient.invalidateQueries({ 
        queryKey: ['user-posts'],
        refetchType: 'all'
      })
      await queryClient.invalidateQueries({ 
        queryKey: ['following-posts'],
        refetchType: 'all'
      })
      
      await queryClient.invalidateQueries({ 
        queryKey: ['bookmarks'],
        refetchType: 'all'
      })
      
      await queryClient.invalidateQueries({ 
        queryKey: ['post', postId],
        refetchType: 'all'
      })
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

export function useBookmarkPostMutation() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (postId: string) => {
      return toggleBookmarkPostApi(postId)
    },
    onSuccess: async (_data, postId) => {
      await queryClient.invalidateQueries({ 
        queryKey: ['posts'],
        refetchType: 'all'
      })
      await queryClient.invalidateQueries({ 
        queryKey: ['user-posts'],
        refetchType: 'all'
      })
      await queryClient.invalidateQueries({ 
        queryKey: ['following-posts'],
        refetchType: 'all'
      })
      await queryClient.invalidateQueries({ 
        queryKey: ['bookmarks'],
        refetchType: 'all'
      })
      
      await queryClient.invalidateQueries({ 
        queryKey: ['post', postId],
        refetchType: 'all'
      })
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message 
        || error.message 
        || 'Failed to bookmark post'
      toast.error(errorMessage)
    },
  })

  return mutation
}