import { Button } from '@/components/ui/button'

interface ProfileStatsProps {
  followersCount: number
  followingCount: number
  isOwnProfile: boolean
  onFollowersClick?: () => void
  onFollowingClick?: () => void
}

export function ProfileStats({ 
  followersCount, 
  followingCount, 
  isOwnProfile,
  onFollowersClick,
  onFollowingClick
}: ProfileStatsProps) {
  return (
    <div className="flex items-center space-x-4 text-sm mb-6">
      <div className="flex items-center space-x-1">
        <span className={isOwnProfile ? "font-semibold text-foreground" : "font-medium"}>
          {followersCount || 0}
        </span>
        {isOwnProfile ? (
          <Button
            variant="link"
            className="text-muted-foreground h-auto p-0 font-normal"
            onClick={onFollowersClick}
          >
            Followers
          </Button>
        ) : (
          <span className="text-muted-foreground">followers</span>
        )}
      </div>
      <div className="flex items-center space-x-1">
        <span className={isOwnProfile ? "font-semibold text-foreground" : "font-medium"}>
          {followingCount || 0}
        </span>
        {isOwnProfile ? (
          <Button
            variant="link"
            className="text-muted-foreground h-auto p-0 font-normal"
            onClick={onFollowingClick}
          >
            Following
          </Button>
        ) : (
          <span className="text-muted-foreground">following</span>
        )}
      </div>
    </div>
  )
}

