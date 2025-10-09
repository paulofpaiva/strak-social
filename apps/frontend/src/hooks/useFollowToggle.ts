import { useState, useEffect, useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { toggleFollowApi } from '@/api/follow'
import { toast } from 'sonner'

interface UseFollowToggleOptions {
  userId: string
  initialIsFollowing?: boolean
  username?: string
}

export function useFollowToggle({ userId, initialIsFollowing = false, username }: UseFollowToggleOptions) {
  const queryClient = useQueryClient()
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (initialIsFollowing !== undefined) {
      setIsFollowing(initialIsFollowing)
    }
  }, [initialIsFollowing])

  const toggleFollow = useCallback(async () => {
    setIsLoading(true)
    try {
      await toggleFollowApi(userId)
      setIsFollowing(!isFollowing)
      
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['explore-users'] }),
        queryClient.invalidateQueries({ queryKey: ['profile'] }),
        queryClient.invalidateQueries({ queryKey: ['following'] }),
        queryClient.invalidateQueries({ queryKey: ['followers'] }),
        queryClient.invalidateQueries({ queryKey: ['user-suggestions'] }),
        username && queryClient.invalidateQueries({ queryKey: ['user-profile', username] })
      ].filter(Boolean))
      
      toast.success(isFollowing ? 'Unfollowed successfully' : 'Following successfully')
    } catch (error) {
      console.error('Failed to toggle follow:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to update follow status. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [userId, isFollowing, queryClient, username])

  return {
    isFollowing,
    isLoading,
    toggleFollow,
  }
}

