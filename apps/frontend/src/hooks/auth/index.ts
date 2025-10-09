import { useMutation, useQuery } from '@tanstack/react-query'
import { checkUsernameApi } from '@/api/auth'
import { getUserByUsernameApi } from '@/api/users'
import { useAuthStore } from '@/stores/authStore'
import { useSession } from './useSession'
import { useAuthMutations } from './useAuthMutations'
import { useProfileMutations } from './useProfileMutations'

export function useAuth() {
  const { isAuthenticated } = useAuthStore()
  const session = useSession()
  const authMutations = useAuthMutations()
  const profileMutations = useProfileMutations()

  const isLoading = session.isLoadingSession || authMutations.isLoading || profileMutations.isLoading

  return {
    user: session.user,
    isAuthenticated,
    connectionError: session.connectionError,
    
    isLoading,
    
    login: authMutations.login,
    signUp: authMutations.signUp,
    logout: authMutations.logout,
    loginMutation: authMutations.loginMutation,
    signUpMutation: authMutations.signUpMutation,
    logoutMutation: authMutations.logoutMutation,
    
    updateProfile: profileMutations.updateProfile,
    updateAvatar: profileMutations.updateAvatar,
    updateCover: profileMutations.updateCover,
    changePassword: profileMutations.changePassword,
    updateProfileMutation: profileMutations.updateProfileMutation,
    updateAvatarMutation: profileMutations.updateAvatarMutation,
    updateCoverMutation: profileMutations.updateCoverMutation,
    changePasswordMutation: profileMutations.changePasswordMutation,
  }
}

export { useSession } from './useSession'
export { useAuthMutations } from './useAuthMutations'
export { useProfileMutations } from './useProfileMutations'

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

