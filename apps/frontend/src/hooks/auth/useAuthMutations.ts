import { useMutation, useQueryClient } from '@tanstack/react-query'
import { signUpApi, signInApi, signOutApi, getSessionApi } from '@/api/auth'
import { useAuthStore } from '@/stores/authStore'

export function useAuthMutations() {
  const { setUser, logout: logoutStore } = useAuthStore()
  const queryClient = useQueryClient()

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
    mutationFn: (data: { name: string; email: string; username: string; password: string; birthDate: string }) =>
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

  const login = async (emailOrUsername: string, password: string) => {
    await loginMutation.mutateAsync({ emailOrUsername, password })
  }

  const signUp = async (data: { name: string; email: string; username: string; password: string; birthDate: string }) => {
    await signUpMutation.mutateAsync(data)
  }

  const logout = async () => {
    await logoutMutation.mutateAsync()
  }

  return {
    login,
    signUp,
    logout,
    loginMutation,
    signUpMutation,
    logoutMutation,
    isLoading: loginMutation.isPending || signUpMutation.isPending || logoutMutation.isPending,
  }
}

