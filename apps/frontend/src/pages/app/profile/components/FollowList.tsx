import { cn } from '@/lib/utils'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useSearchNavigation } from '@/hooks'

interface FollowersListProps {
  users: Array<{ 
    id: string
    name: string
    username: string
    avatar?: string | null
    isFollowing?: boolean
  }>
  variant?: 'followers' | 'following'
  className?: string
  hasSearch?: boolean
  showFollowButton?: boolean
  onToggleFollow?: (userId: string) => void
  onRemoveFollower?: (userId: string) => void
  loadingUsers?: Set<string>
}

export function FollowList({ 
  users, 
  variant = 'following', 
  className, 
  hasSearch = false,
  showFollowButton = false,
  onToggleFollow,
  onRemoveFollower,
  loadingUsers = new Set()
}: FollowersListProps) {
  const { navigateToUserProfile } = useSearchNavigation({
    basePath: `/profile/${variant}`,
    defaultReturnPath: `/profile/${variant}`
  })

  const handleUserClick = (username: string) => {
    navigateToUserProfile(username)
  }

  if (!users || users.length === 0) {
    return (
      <div className={cn('py-12 text-center', className)}>
        {hasSearch ? (
          <p className="text-sm text-muted-foreground">No users found matching your search.</p>
        ) : variant === 'following' ? (
          <p className="text-sm text-muted-foreground">You are not following anyone yet.</p>
        ) : (
          <p className="text-sm text-muted-foreground">You have no followers yet.</p>
        )}
      </div>
    )
  }

  return (
    <div className={cn('space-y-4 pt-4', className)}>
      {users.map((u) => (
        <div key={u.id} className="flex items-center gap-4">
          <div 
            className="cursor-pointer"
            onClick={() => handleUserClick(u.username)}
          >
            <Avatar src={u.avatar ?? undefined} name={u.name} size="md" />
          </div>
          <div 
            className="flex-1 min-w-0 cursor-pointer"
            onClick={() => handleUserClick(u.username)}
          >
            <p className="text-sm font-medium truncate">{u.name}</p>
            <p className="text-xs text-muted-foreground truncate">@{u.username}</p>
          </div>
          {variant === 'followers' && onRemoveFollower ? (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onRemoveFollower(u.id)}
              disabled={loadingUsers.has(u.id)}
              className="rounded-full"
            >
              Remove
            </Button>
          ) : showFollowButton && onToggleFollow ? (
            <Button
              variant={u.isFollowing ? "secondary" : "default"}
              size="sm"
              onClick={(e) => {
                e.preventDefault()
                onToggleFollow(u.id)
              }}
              disabled={loadingUsers.has(u.id)}
              className="rounded-full"
            >
              {u.isFollowing ? "Following" : "Follow"}
            </Button>
          ) : (
            <Button
              variant="default"
              size="sm"
              disabled
              className="rounded-full"
            >
              Following
            </Button>
          )}
        </div>
      ))}
    </div>
  )
}


