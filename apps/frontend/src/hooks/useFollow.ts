import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toggleFollowApi, getFollowStatusApi, getFollowersApi, getFollowingApi } from '@/api/follow'
import { useToast } from '@/hooks/useToast'

export const useToggleFollow = () => {
  const queryClient = useQueryClient()
  const { success: toastSuccess, error: toastError } = useToast()

  return useMutation({
    mutationFn: toggleFollowApi,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['follow-status'] })
      queryClient.invalidateQueries({ queryKey: ['session'] })
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['search'] })
      queryClient.invalidateQueries({ queryKey: ['followers'] })
      queryClient.invalidateQueries({ queryKey: ['following'] })
      
      const message = data.data.isFollowing ? 'User followed successfully!' : 'User unfollowed successfully!'
      toastSuccess(message)
    },
    onError: (error: Error) => {
      toastError(error.message || 'Failed to toggle follow')
    },
  })
}

export const useFollowStatus = (userId: string) => {
  return useQuery({
    queryKey: ['follow-status', userId],
    queryFn: async () => {
      const response = await getFollowStatusApi(userId)
      return response.data.isFollowing
    },
    enabled: !!userId,
  })
}

export const useFollowers = (userId: string, page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['followers', userId, page, limit],
    queryFn: () => getFollowersApi(userId, page, limit),
    enabled: !!userId,
  })
}

export const useFollowing = (userId: string, page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['following', userId, page, limit],
    queryFn: () => getFollowingApi(userId, page, limit),
    enabled: !!userId,
  })
}

export const useFollowUser = useToggleFollow
export const useUnfollowUser = useToggleFollow
