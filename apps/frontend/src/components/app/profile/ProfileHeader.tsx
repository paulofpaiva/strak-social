import { Button } from "@/components/ui/button"
import { Avatar } from "@/components/ui/avatar"
import { getFullCoverUrl } from "@/utils/formatting"
import { Edit, Loader2 } from "lucide-react"
import { useIsMobile } from "@/hooks/useIsMobile"
import { useFollowUser, useUnfollowUser, useFollowStatus } from "@/hooks"

interface ProfileUser {
  id?: string
  name: string
  username: string
  avatar?: string
  cover?: string
  bio?: string
}

interface ProfileHeaderProps {
  user: ProfileUser
  isOwnProfile: boolean
  onEditProfile: () => void
  CoverEditorComponent?: React.ReactNode
  AvatarEditorComponent?: React.ReactNode
  meta?: React.ReactNode
}

export function ProfileHeader({
  user,
  isOwnProfile,
  onEditProfile,
  CoverEditorComponent,
  AvatarEditorComponent,
  meta,
}: ProfileHeaderProps) {
  const isMobile = useIsMobile()
  const followUserMutation = useFollowUser()
  const unfollowUserMutation = useUnfollowUser()
  const { data: followStatus, isLoading: isLoadingStatus } = useFollowStatus(user.id || '')
  
  const isFollowing = followStatus?.isFollowing || false
  const isProcessing = followUserMutation.isPending || unfollowUserMutation.isPending

  const handleFollow = () => {
    if (user.id) {
      followUserMutation.mutate(user.id)
    }
  }

  const handleUnfollow = () => {
    if (user.id) {
      unfollowUserMutation.mutate(user.id)
    }
  }

  return (
    <div className="relative border border-border rounded-lg overflow-hidden">
      {isOwnProfile ? (
        CoverEditorComponent
      ) : (
        <div className="relative h-48 w-full overflow-hidden">
          {user.cover ? (
            <img
              src={getFullCoverUrl(user.cover)}
              alt="Cover photo"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-muted" />
          )}
        </div>
      )}

      <div className="relative px-6 pb-4">
        <div className="relative -mt-16 mb-4">
          {isOwnProfile ? (
            AvatarEditorComponent
          ) : (
            <Avatar src={user.avatar} name={user.name} size="2xl" />
          )}
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-[1fr_auto] gap-4 items-start">
            <div className="min-w-0 overflow-hidden">
              <h1 className="text-2xl font-bold text-foreground truncate pr-2">
                {user.name || 'No name set'}
              </h1>
              <p className="text-muted-foreground truncate pr-2">@{user.username}</p>
              {user.bio && (
                <p className="text-foreground mt-2 leading-relaxed truncate pr-2">
                  {user.bio}
                </p>
              )}
            </div>

            <div className="shrink-0">
              {isOwnProfile ? (
              <Button
                variant="outline"
                size="sm"
                onClick={onEditProfile}
                className="mt-1 rounded-full p-4"
                title="Edit Profile"
              >
                <Edit className="h-4 w-4" />
                {!isMobile && <span className="ml-2">Edit Profile</span>}
              </Button>
            ) : (
              <div className="flex gap-2">
                {isLoadingStatus ? (
                  <Button
                    variant="default"
                    size="sm"
                    disabled
                    className="mt-1 rounded-full px-6"
                  >
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </Button>
                ) : (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={isFollowing ? handleUnfollow : handleFollow}
                    disabled={isProcessing}
                    className="mt-1 rounded-full px-6"
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </Button>
                )}
              </div>
              )}
            </div>
          </div>

          {meta && (
            <div className="mt-2">
              {meta}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


