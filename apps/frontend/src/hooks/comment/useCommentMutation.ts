import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createComment, updateComment, deleteComment, toggleLikeComment } from '@/api/comments'
import type { MediaFile, MediaOrder } from '../post/types'

type MutationType = 'create' | 'update'

interface UseCommentMutationOptions {
  type: MutationType
  commentId?: string
  postId: string
  parentCommentId?: string
  onSuccess?: () => void
}

interface MutationData {
  content: string
  mediaFiles: MediaFile[]
}

export function useCommentMutation(options: UseCommentMutationOptions) {
  const { type, commentId, postId, parentCommentId, onSuccess } = options
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async ({ content, mediaFiles }: MutationData) => {
      if (type === 'create') {
        const orderedFiles = mediaFiles
          .filter(mf => mf.file !== null)
          .map(mf => mf.file!)
        return createComment(postId, { content, parentCommentId }, orderedFiles)
      } else {
        const newFiles = mediaFiles
          .filter(m => m.file !== null)
          .map(m => m.file!)
        
        const mediaOrder: MediaOrder[] = mediaFiles.map(m => ({
          id: m.id,
          isExisting: !!m.isExisting
        }))
        
        if (!commentId) {
          throw new Error('commentId is required for update mutation')
        }
        
        return updateComment(commentId, { content }, newFiles, mediaOrder)
      }
    },
    onSuccess: async () => {
      const message = type === 'create' 
        ? 'Comment created successfully!' 
        : 'Comment updated successfully!'
      toast.success(message)
      
      await queryClient.invalidateQueries({ 
        queryKey: ['comments', postId],
        refetchType: 'all'
      })
      
      await queryClient.invalidateQueries({ 
        queryKey: ['post', postId],
        refetchType: 'all'
      })
      
      await queryClient.invalidateQueries({ 
        queryKey: ['user-posts'],
        refetchType: 'all'
      })
      
      await queryClient.invalidateQueries({ 
        queryKey: ['posts'],
        refetchType: 'all'
      })
      
      await queryClient.invalidateQueries({ 
        queryKey: ['following-posts'],
        refetchType: 'all'
      })
      
      await queryClient.invalidateQueries({ 
        queryKey: ['trending-posts'],
        refetchType: 'all'
      })
      
      await queryClient.invalidateQueries({ 
        queryKey: ['bookmarks'],
        refetchType: 'all'
      })
      
      if (parentCommentId) {
        await queryClient.invalidateQueries({ 
          queryKey: ['comment-replies-infinite', parentCommentId],
          refetchType: 'all'
        })
        await queryClient.invalidateQueries({ 
          queryKey: ['comment', parentCommentId],
          refetchType: 'all'
        })
      }
      
      if (type === 'update' && commentId) {
        await queryClient.invalidateQueries({ 
          queryKey: ['comment', commentId],
          refetchType: 'all'
        })
      }
      
      onSuccess?.()
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message 
        || error.message 
        || `Failed to ${type} comment`
      toast.error(errorMessage)
    },
  })

  return mutation
}

export function useLikeCommentMutation() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async ({ commentId, postId, parentCommentId }: { commentId: string; postId: string; parentCommentId?: string }) => {
      return toggleLikeComment(commentId)
    },
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ 
        queryKey: ['comments', variables.postId],
        refetchType: 'all'
      })
      
      await queryClient.invalidateQueries({ 
        queryKey: ['user-posts'],
        refetchType: 'all'
      })
      
      await queryClient.invalidateQueries({ 
        queryKey: ['posts'],
        refetchType: 'all'
      })
      
      await queryClient.invalidateQueries({ 
        queryKey: ['following-posts'],
        refetchType: 'all'
      })
      
      await queryClient.invalidateQueries({ 
        queryKey: ['trending-posts'],
        refetchType: 'all'
      })
      
      if (variables.parentCommentId) {
        await queryClient.invalidateQueries({ 
          queryKey: ['comment-replies-infinite', variables.parentCommentId],
          refetchType: 'all'
        })
      }
      
      await queryClient.invalidateQueries({ 
        queryKey: ['comment-replies-infinite'],
        refetchType: 'all'
      })
      
      await queryClient.invalidateQueries({ 
        queryKey: ['comment', variables.commentId],
        refetchType: 'all'
      })
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message 
        || error.message 
        || 'Failed to like comment'
      toast.error(errorMessage)
    },
  })

  return mutation
}

export function useDeleteCommentMutation() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async ({ commentId, postId, parentCommentId }: { commentId: string; postId: string; parentCommentId?: string }) => {
      return deleteComment(commentId)
    },
    onSuccess: async (_data, variables) => {
      toast.success('Comment deleted successfully!')
      
      await queryClient.invalidateQueries({ 
        queryKey: ['comments', variables.postId],
        refetchType: 'all'
      })
      
      await queryClient.invalidateQueries({ 
        queryKey: ['post', variables.postId],
        refetchType: 'all'
      })
      
      await queryClient.invalidateQueries({ 
        queryKey: ['user-posts'],
        refetchType: 'all'
      })
      
      await queryClient.invalidateQueries({ 
        queryKey: ['posts'],
        refetchType: 'all'
      })
      
      await queryClient.invalidateQueries({ 
        queryKey: ['following-posts'],
        refetchType: 'all'
      })
      
      await queryClient.invalidateQueries({ 
        queryKey: ['trending-posts'],
        refetchType: 'all'
      })
      
      await queryClient.invalidateQueries({ 
        queryKey: ['bookmarks'],
        refetchType: 'all'
      })
      
      if (variables.parentCommentId) {
        await queryClient.invalidateQueries({ 
          queryKey: ['comment-replies-infinite', variables.parentCommentId],
          refetchType: 'all'
        })
        await queryClient.invalidateQueries({ 
          queryKey: ['comment', variables.parentCommentId],
          refetchType: 'all'
        })
      }
      
      await queryClient.invalidateQueries({ 
        queryKey: ['comment-replies-infinite'],
        refetchType: 'all'
      })
      
      queryClient.removeQueries({ 
        queryKey: ['comment', variables.commentId]
      })
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message 
        || error.message 
        || 'Failed to delete comment'
      toast.error(errorMessage)
    },
  })

  return mutation
}

