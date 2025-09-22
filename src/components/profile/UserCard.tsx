import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { useFollowUser, useUnfollowUser, useFollowStatus, useAuth } from '@/hooks'

interface User {
  id: string
  name: string
  username: string
  avatar?: string | null
  bio?: string | null
  createdAt: string
}

interface UserCardProps {
  user: User
  className?: string
  showFollowButton?: boolean
  onClick?: () => void
}

export function UserCard({ user, className, showFollowButton = true, onClick }: UserCardProps) {
  const { user: currentUser } = useAuth()
  const followUserMutation = useFollowUser()
  const unfollowUserMutation = useUnfollowUser()
  const { data: followStatus, isLoading: isLoadingStatus } = useFollowStatus(user.id)
  
  const isFollowing = followStatus?.isFollowing || false
  const isOwnProfile = currentUser?.id === user.id
  const isProcessing = followUserMutation.isPending || unfollowUserMutation.isPending

  const handleFollow = () => {
    followUserMutation.mutate(user.id)
  }

  const handleUnfollow = () => {
    unfollowUserMutation.mutate(user.id)
  }

  const FollowButton = () => {
    if (isOwnProfile || !showFollowButton) {
      return null
    }
    
    if (isLoadingStatus) {
      return (
        <Button size="sm" variant="outline" disabled className="ml-2 shrink-0">
          <Loader2 className="h-4 w-4 animate-spin" />
        </Button>
      )
    }

    return (
      <Button
        size="sm"
        variant="default"
        onClick={isFollowing ? handleUnfollow : handleFollow}
        disabled={isProcessing}
        className="ml-2 shrink-0 rounded-full"
      >
        <span className="hidden sm:inline">
          {isFollowing ? 'Following' : 'Follow'}
        </span>
      </Button>
    )
  }

  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) {
      return
    }
    onClick?.()
  }

  return (
    <div 
      className={`flex items-center justify-between p-3 border border-border rounded-lg hover:bg-accent/50 transition-colors ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={handleCardClick}
    >
      <div className="flex items-center space-x-3 min-w-0 flex-1">
        <Avatar
          src={user.avatar || undefined}
          name={user.name}
          className="w-10 h-10 shrink-0"
        />
        <div className="flex-1 min-w-0 pr-2">
          <h4 className="font-semibold text-foreground truncate max-w-[200px] sm:max-w-[250px]">
            {user.name}
          </h4>
          <span className="text-muted-foreground text-sm truncate block max-w-[180px] sm:max-w-[220px]">
            @{user.username}
          </span>
          {user.bio && (
            <p className="text-sm text-muted-foreground truncate mt-1 max-w-[200px] sm:max-w-none">
              {user.bio}
            </p>
          )}
        </div>
      </div>
      <FollowButton />
    </div>
  )
}
