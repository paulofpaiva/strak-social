import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { removePostFromListApi } from '@/api/lists'

export function useRemovePostFromList() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ listId, postId }: { listId: string; postId: string }) => 
      removePostFromListApi(listId, postId),
    onSuccess: async (data, variables) => {
      const { listId, postId } = variables
      
      await queryClient.invalidateQueries({ queryKey: ['listPosts', listId] })
      
      await queryClient.invalidateQueries({ queryKey: ['list', listId] })
      
      await queryClient.invalidateQueries({ queryKey: ['postLists', postId] })
      
      await queryClient.invalidateQueries({ queryKey: ['lists'] })
      
      toast.success('Post removed from list')
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Failed to remove post from list'
      toast.error(errorMessage)
    },
  })
}
