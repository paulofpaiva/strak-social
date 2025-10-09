import { Button } from '@/components/ui/button'
import { Edit } from 'lucide-react'

interface ProfileActionsProps {
  isOwnProfile: boolean
  isFollowing?: boolean
  isFollowLoading?: boolean
  onEditClick?: () => void
  onFollowClick?: () => void
}

export function ProfileActions({ 
  isOwnProfile, 
  isFollowing = false,
  isFollowLoading = false,
  onEditClick,
  onFollowClick 
}: ProfileActionsProps) {
  if (isOwnProfile) {
    return (
      <Button 
        variant="outline" 
        className='rounded-full' 
        size="sm" 
        onClick={onEditClick}
      >
        <Edit className="h-4 w-4 sm:hidden" />
        <span className="hidden sm:inline">Edit profile</span>
      </Button>
    )
  }

  return (
    <Button
      variant={isFollowing ? "secondary" : "default"}
      size="sm"
      onClick={onFollowClick}
      disabled={isFollowLoading}
      className="rounded-full"
    >
      {isFollowing ? "Following" : "Follow"}
    </Button>
  )
}

