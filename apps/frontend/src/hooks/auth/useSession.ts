import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getSessionApi } from '@/api/auth'
import { useAuthStore } from '@/stores/authStore'

export function useSession() {
  const { user, setUser } = useAuthStore()
  const [hasCheckedSession, setHasCheckedSession] = useState(false)
  const [connectionError, setConnectionError] = useState<string | null>(null)

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

  return {
    user,
    isLoadingSession,
    connectionError,
    hasCheckedSession,
  }
}

