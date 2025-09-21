import { useAuth as useAuthContext } from '@/contexts/AuthContext'

export const useAuth = useAuthContext

export const useLogin = () => {
  const { login, isLoading } = useAuth()
  
  return {
    login,
    isLoading,
  }
}

export const useLogout = () => {
  const { logout, isLoading } = useAuth()
  
  return {
    logout,
    isLoading,
  }
}

export const useSignUp = () => {
  const { signUp, isLoading } = useAuth()
  
  return {
    signUp,
    isLoading,
  }
}
