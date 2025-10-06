import { useAuthStore } from '@/stores/authStore'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { signUpApi, signInApi, signOutApi, getSessionApi, checkUsernameApi } from '@/api/auth'
import { updateProfileApi, updateAvatarApi, updateCoverApi, changePasswordApi } from '@/api/profile'
import { getUserByUsernameApi } from '../api/users'
import { useEffect, useState } from 'react'

export const useAuth = () => {
  const { user, isAuthenticated, setUser, logout: logoutStore } = useAuthStore()
  const queryClient = useQueryClient()
  const [hasCheckedSession, setHasCheckedSession] = useState(false)

  const shouldCheckSession = !hasCheckedSession

  const { data: sessionData, isLoading: isLoadingSession, error } = useQuery({
    queryKey: ['session'],
    queryFn: getSessionApi,
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    gcTime: Infinity,
    enabled: shouldCheckSession,
    throwOnError: false, 
  })

  const loginMutation = useMutation({
    mutationFn: ({ emailOrUsername, password }: { emailOrUsername: string; password: string }) => 
      signInApi({ emailOrUsername, password }),
    onSuccess: async (data) => {
      setUser(data.user)
      try {
        const refreshed = await queryClient.fetchQuery({ queryKey: ['session'], queryFn: getSessionApi })
        if (refreshed?.user) setUser(refreshed.user)
      } catch {}
    },
    onError: (error: any) => {
      throw new Error(error.message || 'Login failed')
    },
  })

  const signUpMutation = useMutation({
    mutationFn: (data: { name: string; email: string; username: string; password: string; birthDate: string; avatar?: string }) =>
      signUpApi(data),
    onSuccess: (data) => {
      setUser(data.user)
    },
    onError: (error: any) => {
      throw new Error(error.message || 'Sign up failed')
    },
  })

  const logoutMutation = useMutation({
    mutationFn: signOutApi,
    onSuccess: () => {
      logoutStore()
      queryClient.clear()
    },
    onError: (error: any) => {
      logoutStore()
      queryClient.clear()
      throw new Error(error.message || 'Logout failed')
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
    onError: (error: any) => {
      throw new Error(error.message || 'Profile update failed')
    },
  })

  const updateAvatarMutation = useMutation({
    mutationFn: (avatar: string) => updateAvatarApi(avatar),
    onSuccess: (data) => {
      setUser(data.user)
      queryClient.invalidateQueries({ queryKey: ['session'] })
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      queryClient.invalidateQueries({ queryKey: ['user-posts'] })
      queryClient.invalidateQueries({ queryKey: ['comments'] })
    },
    onError: (error: any) => {
      throw new Error(error.message || 'Avatar update failed')
    },
  })

  const updateCoverMutation = useMutation({
    mutationFn: (cover: string) => updateCoverApi(cover),
    onSuccess: (data) => {
      setUser(data.user)
      queryClient.invalidateQueries({ queryKey: ['session'] })
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      queryClient.invalidateQueries({ queryKey: ['user-posts'] })
      queryClient.invalidateQueries({ queryKey: ['comments'] })
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

  useEffect(() => {
    if (sessionData?.user) {
      setUser(sessionData.user)
      setHasCheckedSession(true)
      setConnectionError(null)
    } else if (error || !isLoadingSession) {
      setHasCheckedSession(true)
      if (error) {
        setConnectionError(error.message || 'Connection failed')
      }
    }
  }, [sessionData, error, isLoadingSession, setUser])

  const [connectionError, setConnectionError] = useState<string | null>(null)

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
    connectionError,
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
    onError: (error: any) => {
      throw new Error(error.message || 'Username check failed')
    },
  })

  const checkUsername = async (username: string) => {
    return await checkUsernameMutation.mutateAsync(username)
  }

  return { checkUsername, isLoading: checkUsernameMutation.isPending }
}

export const useUser = (username: string) => {
  return useQuery({
    queryKey: ['user', username],
    queryFn: () => getUserByUsernameApi(username),
    enabled: !!username,
    retry: false,
  })
}
