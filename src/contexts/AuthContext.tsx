import React, { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { signUpApi, signInApi, signOutApi, getSessionApi } from '@/api/auth'

interface User {
  id: string
  email: string
  name: string
  emailVerified: boolean
  createdAt: string
  updatedAt: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  signUp: (data: { name: string; email: string; password: string }) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const queryClient = useQueryClient()

  const { data: sessionData, isLoading: isLoadingSession, error } = useQuery({
    queryKey: ['session'],
    queryFn: getSessionApi,
    retry: false,
    refetchOnWindowFocus: false,
  })

  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      return await signInApi({ email, password })
    },
    onSuccess: (data) => {
      setUser(data.user)
      queryClient.invalidateQueries({ queryKey: ['session'] })
    },
    onError: (error: any) => {
      throw new Error(error.message || 'Login failed')
    },
  })

  const logoutMutation = useMutation({
    mutationFn: signOutApi,
    onSuccess: () => {
      setUser(null)
      queryClient.clear()
    },
  })

  const signUpMutation = useMutation({
    mutationFn: signUpApi,
    onSuccess: (data) => {
      setUser(data.user)
      queryClient.invalidateQueries({ queryKey: ['session'] })
    },
    onError: (error: any) => {
      throw new Error(error.message || 'Sign up failed')
    },
  })

  useEffect(() => {
    if (sessionData?.user) {
      setUser(sessionData.user)
    } else if (error) {
      setUser(null)
    }
  }, [sessionData, error])

  const login = async (email: string, password: string) => {
    await loginMutation.mutateAsync({ email, password })
  }

  const logout = async () => {
    await logoutMutation.mutateAsync()
  }

  const signUp = async (data: { name: string; email: string; password: string }) => {
    await signUpMutation.mutateAsync(data)
  }

  const value: AuthContextType = {
    user,
    isLoading: isLoadingSession || loginMutation.isPending || logoutMutation.isPending || signUpMutation.isPending,
    isAuthenticated: !!user,
    login,
    logout,
    signUp,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
