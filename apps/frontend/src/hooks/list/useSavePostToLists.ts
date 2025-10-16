import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { setPostListsApi } from '@/api/lists'

export function useSavePostToLists() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ postId, listIds }: { postId: string; listIds: string[] }) => 
      setPostListsApi(postId, listIds),
    onSuccess: async (data, variables) => {
      const { postId, listIds } = variables
      
      await queryClient.invalidateQueries({ queryKey: ['postLists', postId] })
      
      listIds.forEach(listId => {
        queryClient.invalidateQueries({ queryKey: ['listPosts', listId] })
        queryClient.invalidateQueries({ queryKey: ['list', listId] })
      })
      
      await queryClient.invalidateQueries({ queryKey: ['lists'] })
      
      toast.success('Post lists updated successfully!')
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Failed to save post to lists'
      toast.error(errorMessage)
    },
  })
}
