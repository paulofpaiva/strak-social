import { cn } from '@/lib/utils'
import { Avatar } from '@/components/ui/avatar'

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
          <Avatar src={u.avatar ?? undefined} name={u.name} size="md" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{u.name}</p>
            <p className="text-xs text-muted-foreground truncate">@{u.username}</p>
          </div>
          {variant === 'followers' && onRemoveFollower ? (
            <button
              onClick={() => onRemoveFollower(u.id)}
              disabled={loadingUsers.has(u.id)}
              className="px-4 h-8 rounded-full text-xs font-medium transition-colors cursor-pointer bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Remove
            </button>
          ) : showFollowButton && onToggleFollow ? (
            <button
              onClick={() => onToggleFollow(u.id)}
              disabled={loadingUsers.has(u.id)}
              className={cn(
                "px-4 h-8 rounded-full text-xs font-medium transition-colors cursor-pointer",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                u.isFollowing
                  ? "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  : "bg-primary text-primary-foreground hover:bg-primary/90"
              )}
            >
              {u.isFollowing ? "Following" : "Follow"}
            </button>
          ) : (
            <button className="px-4 h-8 rounded-full bg-primary text-primary-foreground text-xs font-medium">
              Following
            </button>
          )}
        </div>
      ))}
    </div>
  )
}


