import { BadgeCheck } from 'lucide-react'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { useFollowToggle } from '@/hooks'

interface WhoToFollowCardProps {
  user: {
    id: string
    name: string
    username: string
    avatar: string | null
    bio: string | null
    isVerified: boolean
    isFollowing: boolean
  }
  onFollowToggle?: () => void
}

export function WhoToFollowCard({ user, onFollowToggle }: WhoToFollowCardProps) {
  const { isFollowing, isLoading, toggleFollow } = useFollowToggle({
    userId: user.id,
    initialIsFollowing: user.isFollowing,
    username: user.username
  })

  const handleFollowClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    await toggleFollow()
    onFollowToggle?.()
  }

  return (
    <Link 
      to={`/${user.username}`}
      className="flex items-start gap-3 rounded-lg border border-border p-3 transition-colors"
    >
      <Avatar src={user.avatar || undefined} name={user.name} size="md" />
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1">
          <p className="font-semibold text-sm truncate">{user.name}</p>
          {user.isVerified && (
            <BadgeCheck className="h-4 w-4 text-primary flex-shrink-0" />
          )}
        </div>
        <p className="text-xs text-muted-foreground truncate">@{user.username}</p>
        {user.bio && (
          <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
            {user.bio}
          </p>
        )}
      </div>
      
      <Button
        size="sm"
        variant={isFollowing ? "secondary" : "outline"}
        className="shrink-0 h-8 px-3 text-xs font-semibold"
        disabled={isLoading}
        onClick={handleFollowClick}
      >
        {isLoading ? "..." : isFollowing ? "Following" : "Follow"}
      </Button>
    </Link>
  )
}

