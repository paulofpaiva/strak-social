import { useQuery } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { getProfileApi } from '@/api/profile'
import { getUserByUsernameApi } from '@/api/users'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { CheckCircle } from 'lucide-react'
import { ProfileSkeleton } from '../../../components/skeleton/ProfileSkeleton'
import { UserProfileSkeleton } from '../../../components/skeleton/UserProfileSkeleton'
import { ErrorEmpty } from '@/components/ErrorEmpty'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { EditProfile } from '@/pages/app/Profile/components/EditProfile'
import { ProfileHeader } from '@/pages/app/Profile/components/ProfileHeader'
import { ProfileInfo } from '@/pages/app/Profile/components/ProfileInfo'
import { ProfileActions } from '@/pages/app/Profile/components/ProfileActions'
import { ProfileStats } from '@/pages/app/Profile/components/ProfileStats'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
        <Breadcrumb to={isOwnProfile ? "/feed" : getReturnUrl()} label="Back" />
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
          <Tabs defaultValue="posts" className="w-full">
            <TabsList>
              <TabsTrigger value="posts" className="cursor-pointer">
                Posts
              </TabsTrigger>
            </TabsList>
            <TabsContent value="posts">
              <PostsList userId={user.id} readOnly={!isOwnProfile} />
            </TabsContent>
          </Tabs>
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
