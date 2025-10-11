import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { cn } from '@/lib/utils'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { toggleFollowApi } from '@/api/follow'
import { toast } from 'sonner'
import { useAuth } from '@/hooks'
import { BadgeCheck } from 'lucide-react'
import { Link } from 'react-router-dom'

interface UserListProps {
  users: Array<{ 
    id: string
    name: string
    username: string
    avatar?: string | null
    bio?: string | null
    isVerified?: boolean
    isFollowing?: boolean
  }>
  className?: string
  onFollowToggled?: (userId: string, isFollowing: boolean) => void
}

export function UserList({ users, className, onFollowToggled }: UserListProps) {
  const [loadingUsers, setLoadingUsers] = useState<Set<string>>(new Set())
  const queryClient = useQueryClient()
  const { user: currentUser } = useAuth()

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
      toast.error(error instanceof Error ? error.message : 'Failed to update follow status. Please try again.')
    } finally {
      setLoadingUsers(prev => {
        const newSet = new Set(prev)
        newSet.delete(userId)
        return newSet
      })
    }
  }

  return (
    <div className={cn('pt-5', className)}>
      {users.map((u) => (
        <div key={u.id} className="flex items-center gap-4 p-4 border-b border-border last:border-b-0">
          <Link 
            to={`/${u.username}`}
            className="flex-shrink-0"
          >
            <Avatar 
              src={u.avatar ?? undefined} 
              name={u.name} 
              size="md"
            />
          </Link>
          <Link 
            to={`/${u.username}`}
            className="flex-1 min-w-0"
          >
            <div className="flex items-center gap-1">
              <p className="font-semibold text-foreground truncate hover:underline">{u.name}</p>
              {u.isVerified && (
                <BadgeCheck className="h-4 w-4 text-primary flex-shrink-0" />
              )}
            </div>
            <p className="text-sm text-muted-foreground truncate hover:underline">@{u.username}</p>
            {u.bio && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{u.bio}</p>
            )}
          </Link>
          {currentUser?.id !== u.id && (
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
          )}
        </div>
      ))}
    </div>
  )
}


