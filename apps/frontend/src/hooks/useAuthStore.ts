import { useAuthStore } from '@/stores/authStore'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { signUpApi, signInApi, signOutApi, getSessionApi, updateProfileApi, updateAvatarApi, updateCoverApi, changePasswordApi, checkUsernameApi } from '@/api/auth'
import { getUserByUsernameApi } from '@/api/users'
import { useEffect, useRef } from 'react'

export const useAuth = () => {
  const { user, isAuthenticated, setUser, logout: logoutStore } = useAuthStore()
  const queryClient = useQueryClient()
  const hasCheckedSession = useRef(false)

  const shouldCheckSession = !hasCheckedSession.current

  const { data: sessionData, isLoading: isLoadingSession, error } = useQuery({
    queryKey: ['session'],
    queryFn: getSessionApi,
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    gcTime: Infinity,
    enabled: shouldCheckSession,
  })

  const loginMutation = useMutation({
    mutationFn: ({ emailOrUsername, password }: { emailOrUsername: string; password: string }) => 
      signInApi({ emailOrUsername, password }),
    onSuccess: async (data) => {
      setUser(data.user)
      hasCheckedSession.current = true
      queryClient.invalidateQueries({ queryKey: ['session'] })
    },
  })

  const signUpMutation = useMutation({
    mutationFn: (data: { name: string; email: string; username: string; password: string; birthDate: string; avatar?: string }) =>
      signUpApi(data),
    onSuccess: (data) => {
      setUser(data.user)
      hasCheckedSession.current = true
      queryClient.invalidateQueries({ queryKey: ['session'] })
    },
  })

  const logoutMutation = useMutation({
    mutationFn: signOutApi,
    onSuccess: () => {
      logoutStore()
      queryClient.clear()
      hasCheckedSession.current = false
    },
    onError: () => {
      logoutStore()
      queryClient.clear()
      hasCheckedSession.current = false
    },
  })

  const updateProfileMutation = useMutation({
    mutationFn: (data: { name?: string; bio?: string; birthDate?: string; username?: string }) => updateProfileApi(data),
    onSuccess: (data) => {
      setUser(data.user)
      queryClient.invalidateQueries({ queryKey: ['session'] })
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      queryClient.invalidateQueries({ queryKey: ['user-posts'] })
      queryClient.invalidateQueries({ queryKey: ['comments'] })
    },
  })

  const updateAvatarMutation = useMutation({
    mutationFn: (avatar: string) => updateAvatarApi(avatar),
    onSuccess: (data) => {
      setUser(data.user)
      queryClient.invalidateQueries({ queryKey: ['session'] })
    },
  })

  const updateCoverMutation = useMutation({
    mutationFn: (cover: string) => updateCoverApi(cover),
    onSuccess: (data) => {
      setUser(data.user)
      queryClient.invalidateQueries({ queryKey: ['session'] })
    },
  })

  const changePasswordMutation = useMutation({
    mutationFn: (data: { currentPassword: string; newPassword: string; confirmPassword: string }) => changePasswordApi(data),
  })

  useEffect(() => {
    if (!isLoadingSession && !hasCheckedSession.current) {
      if (sessionData?.user) {
        setUser(sessionData.user)
      } else if (sessionData === null) {
        logoutStore()
      }
      hasCheckedSession.current = true
    }
  }, [sessionData, isLoadingSession, setUser, logoutStore])

  const login = async (emailOrUsername: string, password: string) => {
    await loginMutation.mutateAsync({ emailOrUsername, password })
  }

  const signUp = async (data: { name: string; email: string; username: string; password: string; birthDate: string; avatar?: string }) => {
    await signUpMutation.mutateAsync(data)
  }

  const logout = async () => {
    await logoutMutation.mutateAsync()
  }

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
    user,
    isAuthenticated,
    isLoading: isLoadingSession || loginMutation.isPending || signUpMutation.isPending || logoutMutation.isPending || updateProfileMutation.isPending || updateAvatarMutation.isPending || updateCoverMutation.isPending || changePasswordMutation.isPending,
    login,
    signUp,
    logout,
    updateProfile,
    updateAvatar,
    updateCover,
    changePassword,
    loginMutation,
    signUpMutation,
    logoutMutation,
    updateProfileMutation,
    updateAvatarMutation,
    updateCoverMutation,
    changePasswordMutation,
  }
}

export const useLogin = () => {
  const { login, loginMutation } = useAuth()
  return { login, isLoading: loginMutation.isPending }
}

export const useSignUp = () => {
  const { signUp, signUpMutation } = useAuth()
  return { signUp, isLoading: signUpMutation.isPending }
}

export const useLogout = () => {
  const { logout, logoutMutation } = useAuth()
  return { logout, isLoading: logoutMutation.isPending }
}

export const useUpdateProfile = () => {
  const { updateProfile, updateProfileMutation } = useAuth()
  return { updateProfile, isLoading: updateProfileMutation.isPending }
}

export const useUpdateAvatar = () => {
  const { updateAvatar, updateAvatarMutation } = useAuth()
  return { updateAvatar, isLoading: updateAvatarMutation.isPending }
}

export const useUpdateCover = () => {
  const { updateCover, updateCoverMutation } = useAuth()
  return { updateCover, isLoading: updateCoverMutation.isPending }
}

export const useChangePassword = () => {
  const { changePassword, changePasswordMutation } = useAuth()
  return { changePassword, isLoading: changePasswordMutation.isPending }
}

export const useCheckUsername = () => {
  const checkUsernameMutation = useMutation({
    mutationFn: checkUsernameApi,
  })

  const checkUsername = async (username: string) => {
    return await checkUsernameMutation.mutateAsync(username)
  }

  return { checkUsername, isLoading: checkUsernameMutation.isPending }
}

export const useUser = (username: string) => {
  return useQuery({
    queryKey: ['user', username],
    queryFn: async () => {
      const response = await getUserByUsernameApi(username)
      return response.data
    },
    enabled: !!username,
    retry: false,
  })
}
