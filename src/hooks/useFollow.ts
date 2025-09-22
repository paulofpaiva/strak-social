import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { followUserApi, unfollowUserApi, getFollowStatusApi } from '@/api/follow'
import { useToast } from '@/hooks/useToast'

export const useFollowUser = () => {
  const queryClient = useQueryClient()
  const { success: toastSuccess, error: toastError } = useToast()

  return useMutation({
    mutationFn: followUserApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['follow-status'] })
      queryClient.invalidateQueries({ queryKey: ['session'] })
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['search'] })
      toastSuccess('User followed successfully!')
    },
    onError: (error: Error) => {
      toastError(error.message || 'Failed to follow user')
    },
  })
}

export const useUnfollowUser = () => {
  const queryClient = useQueryClient()
  const { success: toastSuccess, error: toastError } = useToast()

  return useMutation({
    mutationFn: unfollowUserApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['follow-status'] })
      queryClient.invalidateQueries({ queryKey: ['session'] })
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['search'] })
      toastSuccess('User unfollowed successfully!')
    },
    onError: (error: Error) => {
      toastError(error.message || 'Failed to unfollow user')
    },
  })
}

export const useFollowStatus = (userId: string) => {
  return useQuery({
    queryKey: ['follow-status', userId],
    queryFn: () => getFollowStatusApi(userId),
    enabled: !!userId,
  })
}
