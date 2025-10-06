import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { cn } from '@/lib/utils'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { toggleFollowApi } from '@/api/follow'
import { useToastContext } from '@/contexts/ToastContext'
import { useSearchNavigation } from '@/hooks'

interface UserListProps {
  users: Array<{ 
    id: string
    name: string
    username: string
    avatar?: string | null
    bio?: string | null
    isFollowing?: boolean
  }>
  className?: string
  onFollowToggled?: (userId: string, isFollowing: boolean) => void
}

export function UserList({ users, className, onFollowToggled }: UserListProps) {
  const [loadingUsers, setLoadingUsers] = useState<Set<string>>(new Set())
  const queryClient = useQueryClient()
  const { error: showError } = useToastContext()
  const { navigateToUserProfile } = useSearchNavigation({
    basePath: '/explore',
    defaultReturnPath: '/explore'
  })

  if (!users || users.length === 0) {
    return (
      <div className={cn('py-12 text-center', className)}>
        <p className="text-sm text-muted-foreground">No users found.</p>
      </div>
    )
  }

  const handleToggleFollow = async (userId: string, currentIsFollowing: boolean) => {
    setLoadingUsers(prev => new Set(prev).add(userId))
    
    try {
      await toggleFollowApi(userId)
      
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['explore-users'] }),
        queryClient.invalidateQueries({ queryKey: ['profile'] }),
        queryClient.invalidateQueries({ queryKey: ['following'] }),
        queryClient.invalidateQueries({ queryKey: ['followers'] })
      ])

      onFollowToggled?.(userId, !currentIsFollowing)
    } catch (error) {
      console.error('Failed to toggle follow:', error)
      showError(error instanceof Error ? error.message : 'Failed to update follow status. Please try again.')
    } finally {
      setLoadingUsers(prev => {
        const newSet = new Set(prev)
        newSet.delete(userId)
        return newSet
      })
    }
  }

  const handleUserClick = (username: string) => {
    navigateToUserProfile(username)
  }

  return (
    <div className={cn('space-y-4', className)}>
      {users.map((u) => (
        <div key={u.id} className="flex items-start gap-4">
          <div 
            className="cursor-pointer"
            onClick={() => handleUserClick(u.username)}
          >
            <Avatar 
              src={u.avatar ?? undefined} 
              name={u.name} 
              size="md"
            />
          </div>
          <div 
            className="flex-1 min-w-0 cursor-pointer"
            onClick={() => handleUserClick(u.username)}
          >
            <p className="text-sm font-medium truncate">{u.name}</p>
            <p className="text-xs text-muted-foreground truncate">@{u.username}</p>
            {u.bio && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{u.bio}</p>
            )}
          </div>
          <Button
            variant={u.isFollowing ? "secondary" : "default"}
            size="sm"
            onClick={(e) => {
              e.preventDefault()
              handleToggleFollow(u.id, !!u.isFollowing)
            }}
            disabled={loadingUsers.has(u.id)}
            className="rounded-full"
          >
            {u.isFollowing ? "Following" : "Follow"}
          </Button>
        </div>
      ))}
    </div>
  )
}


