import { cn } from '@/lib/utils'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useSearchNavigation } from '@/hooks'
import { BadgeCheck } from 'lucide-react'
import { Link } from 'react-router-dom'

interface FollowersListProps {
  users: Array<{ 
    id: string
    name: string
    username: string
    avatar?: string | null
    isVerified?: boolean
    isFollowing?: boolean
  }>
  variant?: 'followers' | 'following'
  className?: string
  hasSearch?: boolean
  showFollowButton?: boolean
  onToggleFollow?: (userId: string) => void
  onRemoveFollower?: (userId: string) => void
  loadingUsers?: Set<string>
  isOwnProfile?: boolean
  currentUserId?: string
}

export function FollowList({ 
  users, 
  variant = 'following', 
  className, 
  hasSearch = false,
  showFollowButton = false,
  onToggleFollow,
  onRemoveFollower,
  loadingUsers = new Set(),
  isOwnProfile = true,
  currentUserId
}: FollowersListProps) {
  if (!users || users.length === 0) {
    return (
      <div className={cn('py-12 text-center', className)}>
        {hasSearch ? (
          <p className="text-sm text-muted-foreground">No users found matching your search.</p>
        ) : variant === 'following' ? (
          <p className="text-sm text-muted-foreground">
            {isOwnProfile ? 'You are not following anyone yet.' : 'This user is not following anyone yet.'}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            {isOwnProfile ? 'You have no followers yet.' : 'This user has no followers yet.'}
          </p>
        )}
      </div>
    )
  }

  return (
    <div className={cn('pt-5', className)}>
      {users.map((u) => (
        <div key={u.id} className="flex items-center gap-4 p-4 border-b border-border last:border-b-0">
          <Link 
            to={`/${u.username}`}
            className="flex-shrink-0"
          >
            <Avatar src={u.avatar ?? undefined} name={u.name} size="md" />
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
          </Link>
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
          ) : showFollowButton && onToggleFollow && currentUserId !== u.id ? (
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
          ) : !isOwnProfile && currentUserId !== u.id ? (
            <Button
              variant="default"
              size="sm"
              disabled
              className="rounded-full"
            >
              Following
            </Button>
          ) : null}
        </div>
      ))}
    </div>
  )
}


