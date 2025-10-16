import { useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  createListApi, 
  updateListApi, 
  deleteListApi,
  followListApi,
  unfollowListApi,
  removeListMemberApi,
  deleteListCoverApi,
} from '@/api/lists'
import { toast } from 'sonner'

export function useCreateList() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createListApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lists'] })
      toast.success('List created successfully!')
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to create list. Please try again.'
      toast.error(errorMessage)
    },
  })
}

export function useUpdateList() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateListApi(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['lists'] })
      queryClient.invalidateQueries({ queryKey: ['list', variables.id] })
      toast.success('List updated successfully!')
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to update list. Please try again.'
      toast.error(errorMessage)
    },
  })
}

export function useDeleteList() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteListApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lists'] })
      toast.success('List deleted successfully!')
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to delete list. Please try again.'
      toast.error(errorMessage)
    },
  })
}

export function useFollowList() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: followListApi,
    onSuccess: (data, listId) => {
      queryClient.invalidateQueries({ queryKey: ['lists'] })
      queryClient.invalidateQueries({ queryKey: ['list', listId] })
      queryClient.invalidateQueries({ queryKey: ['search-lists'] })
      toast.success('List followed successfully!')
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to follow list. Please try again.'
      toast.error(errorMessage)
    },
  })
}

export function useUnfollowList() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: unfollowListApi,
    onSuccess: (data, listId) => {
      queryClient.invalidateQueries({ queryKey: ['lists'] })
      queryClient.invalidateQueries({ queryKey: ['list', listId] })
      queryClient.invalidateQueries({ queryKey: ['search-lists'] })
      toast.success('List unfollowed successfully!')
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to unfollow list. Please try again.'
      toast.error(errorMessage)
    },
  })
}


export function useRemoveMember() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ listId, userId }: { listId: string; userId: string }) => 
      removeListMemberApi(listId, userId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['list-members', variables.listId] })
      queryClient.invalidateQueries({ queryKey: ['list', variables.listId] })
      queryClient.invalidateQueries({ queryKey: ['lists'] })
      toast.success('Member removed successfully!')
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to remove member. Please try again.'
      toast.error(errorMessage)
    },
  })
}

export function useDeleteListCover() {
  return useMutation({
    mutationFn: deleteListCoverApi,
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to delete list cover. Please try again.'
      toast.error(errorMessage)
    },
  })
}

