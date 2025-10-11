import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateProfileApi, updateAvatarApi, updateCoverApi, changePasswordApi } from '@/api/profile'
import { useAuthStore } from '@/stores/authStore'

export function invalidateUserRelatedQueries(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: ['session'] })
  queryClient.invalidateQueries({ queryKey: ['profile'] })
  queryClient.invalidateQueries({ queryKey: ['posts'] })
  queryClient.invalidateQueries({ queryKey: ['user-posts'] })
  queryClient.invalidateQueries({ queryKey: ['comments'] })
  queryClient.invalidateQueries({ queryKey: ['user-profile'] })
}

export function useProfileMutations() {
  const { setUser } = useAuthStore()
  const queryClient = useQueryClient()

  const updateProfileMutation = useMutation({
    mutationFn: (data: { name?: string; bio?: string; birthDate?: string; username?: string }) => updateProfileApi(data),
    onSuccess: (data) => {
      setUser(data.user)
      invalidateUserRelatedQueries(queryClient)
    },
    onError: (error: any) => {
      throw new Error(error.message || 'Profile update failed')
    },
  })

  const updateAvatarMutation = useMutation({
    mutationFn: (avatar: string) => updateAvatarApi(avatar),
    onSuccess: (data) => {
      setUser(data.user)
      
      queryClient.setQueryData(['profile'], (oldData: any) => {
        if (oldData?.user) {
          return { ...oldData, user: { ...oldData.user, avatar: data.user.avatar } }
        }
        return oldData
      })
      
      setTimeout(() => {
        invalidateUserRelatedQueries(queryClient)
      }, 0)
    },
    onError: (error: any) => {
      throw new Error(error.message || 'Avatar update failed')
    },
  })

  const updateCoverMutation = useMutation({
    mutationFn: (cover: string) => updateCoverApi(cover),
    onSuccess: (data) => {
      setUser(data.user)
      
      queryClient.setQueryData(['profile'], (oldData: any) => {
        if (oldData?.user) {
          return { ...oldData, user: { ...oldData.user, cover: data.user.cover } }
        }
        return oldData
      })
      
      setTimeout(() => {
        invalidateUserRelatedQueries(queryClient)
      }, 0)
    },
    onError: (error: any) => {
      throw new Error(error.message || 'Cover update failed')
    },
  })

  const changePasswordMutation = useMutation({
    mutationFn: (data: { currentPassword: string; newPassword: string; confirmPassword: string }) => changePasswordApi(data),
    onError: (error: any) => {
      throw new Error(error.message || 'Password change failed')
    },
  })

  const updateProfile = async (data: { name?: string; bio?: string; birthDate?: string; username?: string }) => {
    await updateProfileMutation.mutateAsync(data)
  }

  const updateAvatar = async (avatar: string) => {
    await updateAvatarMutation.mutateAsync(avatar)
  }

  const updateCover = async (cover: string) => {
    await updateCoverMutation.mutateAsync(cover)
  }

  const changePassword = async (data: { currentPassword: string; newPassword: string; confirmPassword: string }) => {
    await changePasswordMutation.mutateAsync(data)
  }

  return {
    updateProfile,
    updateAvatar,
    updateCover,
    changePassword,
    updateProfileMutation,
    updateAvatarMutation,
    updateCoverMutation,
    changePasswordMutation,
    isLoading: updateProfileMutation.isPending || updateAvatarMutation.isPending || updateCoverMutation.isPending || changePasswordMutation.isPending,
  }
}

