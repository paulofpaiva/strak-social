import { useQuery } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { getProfileApi } from '@/api/profile'
import { getUserByUsernameApi } from '@/api/users'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { CheckCircle, FileText, Image, Heart, Users, Settings, Bookmark, Calendar, MessageSquare, Share2 } from 'lucide-react'
import { ProfileSkeleton } from '../../../components/skeleton/ProfileSkeleton'
import { UserProfileSkeleton } from '../../../components/skeleton/UserProfileSkeleton'
import { ErrorEmpty } from '@/components/ErrorEmpty'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { EditProfile } from '@/pages/app/Profile/components/EditProfile'
import { ProfileHeader } from '@/pages/app/Profile/components/ProfileHeader'
import { ProfileInfo } from '@/pages/app/Profile/components/ProfileInfo'
import { ProfileActions } from '@/pages/app/Profile/components/ProfileActions'
import { ProfileStats } from '@/pages/app/Profile/components/ProfileStats'
import { ScrollableTabs } from '@/components/ui/scrollable-tabs'
import { PostsList } from '@/pages/app/Profile/components/PostsList'
import { useState } from 'react'
import { useAuth, useSearchNavigation, useFollowToggle } from '@/hooks'

export function Profile() {
  const { username } = useParams<{ username: string }>()
  const { user: currentUser } = useAuth()
  const navigate = useNavigate()
  
  const [editOpen, setEditOpen] = useState(false)
  
  const { getReturnUrl } = useSearchNavigation({
    basePath: username ? '/explore' : '/feed',
    defaultReturnPath: username ? '/explore' : '/feed'
  })

  const isOwnProfile = !username || currentUser?.username === username

  const { data: ownProfileData, isLoading: ownLoading, error: ownError, refetch: refetchOwn } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfileApi,
    enabled: isOwnProfile && !username,
    retry: false,
    refetchOnWindowFocus: false,
  })

  const { data: otherUserData, isLoading: otherLoading, error: otherError, refetch: refetchOther } = useQuery({
    queryKey: ['user-profile', username],
    queryFn: () => getUserByUsernameApi(username!),
    enabled: !!username && !isOwnProfile,
    retry: false,
    refetchOnWindowFocus: false,
  })

  const user = isOwnProfile && !username ? ownProfileData?.user : otherUserData
  const isLoading = isOwnProfile && !username ? ownLoading : otherLoading
  const error = isOwnProfile && !username ? ownError : otherError
  const refetch = isOwnProfile && !username ? refetchOwn : refetchOther

  const { isFollowing, isLoading: isFollowLoading, toggleFollow } = useFollowToggle({
    userId: user?.id || '',
    initialIsFollowing: user?.isFollowing,
    username,
  })

  if (isLoading) {
    return isOwnProfile ? <ProfileSkeleton /> : <UserProfileSkeleton />
  }

  if (error || !user) {
    return (
      <div className="container mx-auto">
        <ErrorEmpty
          title={isOwnProfile ? "Failed to load profile" : "User not found"}
          description={isOwnProfile 
            ? "Unable to load profile information. Please check your connection and try again."
            : "The user you're looking for doesn't exist or may have been removed."
          }
          onRetry={() => refetch()}
          retryText="Try again"
        />
      </div>
    )
  }

  return (
    <div className="container mx-auto overflow-x-hidden">
      <Breadcrumb to={isOwnProfile ? "/feed" : getReturnUrl()} label={`${user.username}`} />
      
      <ProfileHeader user={user} isOwnProfile={isOwnProfile} />

      <div className="mt-14 sm:mt-20 px-4">
        <div className="flex items-start justify-between mb-4">
          <ProfileInfo user={user} />
          
          <ProfileActions
            isOwnProfile={isOwnProfile}
            isFollowing={isFollowing}
            isFollowLoading={isFollowLoading}
            onEditClick={() => setEditOpen(true)}
            onFollowClick={toggleFollow}
          />
        </div>

        <ProfileStats
          followersCount={user.followersCount}
          followingCount={user.followingCount}
          isOwnProfile={isOwnProfile}
          onFollowersClick={() => navigate('/profile/followers')}
          onFollowingClick={() => navigate('/profile/following')}
        />

        {isOwnProfile && !user.isVerified && (
          <Alert className="mb-6 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 w-fit max-w-md min-h-[100px] py-4">
            <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-500" />
            <AlertTitle className="text-emerald-900 dark:text-emerald-100 font-semibold">
              You are not verified yet
            </AlertTitle>
            <AlertDescription className="text-emerald-800 dark:text-emerald-200 mt-2">
              Verified accounts gain greater visibility and credibility on the platform. Get your verification badge to stand out and build trust with your audience.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="mt-6">
          <ScrollableTabs
            tabs={[
              {
                id: 'posts',
                label: 'Posts',
                icon: FileText,
                content: <PostsList userId={user.id} readOnly={!isOwnProfile} />
              },
              {
                id: 'media',
                label: 'Media',
                icon: Image,
                content: (
                  <div className="text-center py-12">
                    <Image className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No media yet</h3>
                    <p className="text-muted-foreground">
                      {isOwnProfile ? "You haven't posted any media yet." : "This user hasn't posted any media yet."}
                    </p>
                  </div>
                )
              },
              {
                id: 'likes',
                label: 'Likes',
                icon: Heart,
                content: (
                  <div className="text-center py-12">
                    <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No likes yet</h3>
                    <p className="text-muted-foreground">
                      {isOwnProfile ? "You haven't liked any posts yet." : "This user hasn't liked any posts yet."}
                    </p>
                  </div>
                )
              },
              {
                id: 'bookmarks',
                label: 'Bookmarks',
                icon: Bookmark,
                content: (
                  <div className="text-center py-12">
                    <Bookmark className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No bookmarks yet</h3>
                    <p className="text-muted-foreground">
                      {isOwnProfile ? "You haven't bookmarked any posts yet." : "This user hasn't bookmarked any posts yet."}
                    </p>
                  </div>
                )
              },
              {
                id: 'comments',
                label: 'Comments',
                icon: MessageSquare,
                content: (
                  <div className="text-center py-12">
                    <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No comments yet</h3>
                    <p className="text-muted-foreground">
                      {isOwnProfile ? "You haven't commented on any posts yet." : "This user hasn't commented on any posts yet."}
                    </p>
                  </div>
                )
              },
              {
                id: 'shared',
                label: 'Shared',
                icon: Share2,
                content: (
                  <div className="text-center py-12">
                    <Share2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No shared posts yet</h3>
                    <p className="text-muted-foreground">
                      {isOwnProfile ? "You haven't shared any posts yet." : "This user hasn't shared any posts yet."}
                    </p>
                  </div>
                )
              },
              {
                id: 'followers',
                label: 'Followers',
                icon: Users,
                content: (
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">Followers</h3>
                    <p className="text-muted-foreground">
                      {isOwnProfile ? "Manage your followers here." : "View this user's followers."}
                    </p>
                  </div>
                )
              },
              {
                id: 'activity',
                label: 'Activity',
                icon: Calendar,
                content: (
                  <div className="text-center py-12">
                    <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">Activity Timeline</h3>
                    <p className="text-muted-foreground">
                      {isOwnProfile ? "View your recent activity." : "View this user's recent activity."}
                    </p>
                  </div>
                )
              }
            ]}
          />
        </div>
      </div>

      {isOwnProfile && (
        <EditProfile 
          open={editOpen}
          onOpenChange={setEditOpen}
          defaultValues={{
            bio: user.bio ?? '',
            location: user.location ?? '',
            website: user.website ?? '',
          }}
        />
      )}
    </div>
  )
}
