import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { getProfileApi } from '@/api/profile'
import { getUserByUsernameApi } from '@/api/users'
import { toggleFollowApi } from '@/api/follow'
import { formatDate } from '@/utils/date'
import { AvatarEditor } from '@/pages/app/Profile/components/AvatarEditor'
import { CoverEditor } from '@/pages/app/Profile/components/CoverEditor'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { 
  Calendar, 
  MapPin,
  Link as LinkIcon,
  Edit,
  CheckCircle,
  FileText,
  Image as ImageIcon,
  BadgeCheck
} from 'lucide-react'
import { ProfileSkeleton } from '../../../components/skeleton/ProfileSkeleton'
import { UserProfileSkeleton } from '../../../components/skeleton/UserProfileSkeleton'
import { ErrorEmpty } from '@/components/ErrorEmpty'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { EditProfile } from '@/pages/app/Profile/components/EditProfile'
import { ResponsiveTabs } from '@/components/ui/responsive-tabs-sidebar'
import { PostsList } from '@/pages/app/Profile/components/PostsList'
import { useState, useEffect } from 'react'
import { useAuth, useSearchNavigation } from '@/hooks'
import { toast } from 'sonner'

export function Profile() {
  const { username } = useParams<{ username: string }>()
  const { user: currentUser } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  
  const [editOpen, setEditOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('posts')
  const [isFollowing, setIsFollowing] = useState(false)
  const [isFollowLoading, setIsFollowLoading] = useState(false)
  const [imageLoading, setImageLoading] = useState(false)
  
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

  useEffect(() => {
    if (user?.isFollowing !== undefined) {
      setIsFollowing(user.isFollowing)
    }
  }, [user?.isFollowing])

  useEffect(() => {
    if (user?.cover) {
      setImageLoading(true)
    }
  }, [user?.cover])

  const handleToggleFollow = async () => {
    if (!user || isOwnProfile) return
    
    setIsFollowLoading(true)
    try {
      await toggleFollowApi(user.id)
      setIsFollowing(!isFollowing)
      
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['explore-users'] }),
        queryClient.invalidateQueries({ queryKey: ['profile'] }),
        queryClient.invalidateQueries({ queryKey: ['following'] }),
        queryClient.invalidateQueries({ queryKey: ['followers'] }),
        queryClient.invalidateQueries({ queryKey: ['user-profile', username] })
      ])
      
      toast.success(isFollowing ? 'Unfollowed successfully' : 'Following successfully')
    } catch (error) {
      console.error('Failed to toggle follow:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to update follow status. Please try again.')
    } finally {
      setIsFollowLoading(false)
    }
  }

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
      
      <div className="relative mt-8 -mx-4 sm:mx-0">
        {isOwnProfile ? (
          <CoverEditor 
            src={user.cover} 
            className="h-32 sm:h-48 md:h-64 w-full"
          />
        ) : (
          <div className="h-32 sm:h-48 md:h-64 w-full bg-gray-800 rounded-lg overflow-hidden relative">
            {user.cover ? (
              <>
                {imageLoading && (
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-700 to-gray-600 animate-pulse"></div>
                )}
                <img
                  src={user.cover}
                  alt={`${user.name} cover`}
                  className="w-full h-full object-cover"
                  loading="eager"
                  decoding="async"
                  onLoad={() => setImageLoading(false)}
                  onError={() => setImageLoading(false)}
                />
              </>
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-gray-700 to-gray-600 flex items-center justify-center">
              </div>
            )}
          </div>
        )}
        
        <div className="absolute -bottom-12 sm:-bottom-16 left-4 sm:left-6">
          {isOwnProfile ? (
            <AvatarEditor 
              src={user.avatar} 
              name={user.name} 
              size="2xl"
              className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 border-4 border-background"
            />
          ) : (
            <Avatar 
              src={user.avatar ?? undefined} 
              name={user.name} 
              size="2xl"
              className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 border-4 border-background"
            />
          )}
        </div>
      </div>

      <div className="mt-14 sm:mt-20 px-4">
        <div className="flex items-start justify-between mb-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-foreground">{user.name}</h1>
              {user.isVerified && (
                <BadgeCheck className="h-5 w-5 text-blue-500" />
              )}
            </div>
            <p className="text-muted-foreground">@{user.username}</p>
            {user.bio && (
              <p className="text-foreground text-sm pt-2">{user.bio}</p>
            )}
            {(user.location || user.website || user.createdAt) && (
              <div className="flex flex-wrap items-center gap-4 gap-y-2 pt-2 text-sm">
                {user.location && (
                  <div className="text-muted-foreground flex items-center gap-1 w-full sm:w-auto">
                    <MapPin className="h-4 w-4" />
                    <span>{user.location}</span>
                  </div>
                )}
                {user.website && (
                  <div className="flex items-center gap-1 w-full sm:w-auto">
                    <LinkIcon className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={user.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline break-all"
                    >
                      {user.website}
                    </a>
                  </div>
                )}
                {user.createdAt && (
                  <div className="text-muted-foreground flex items-center gap-1 w-full sm:w-auto">
                    <Calendar className="h-4 w-4" />
                    <span>Joined {formatDate(user.createdAt)}</span>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {isOwnProfile ? (
            <Button variant="outline" className='rounded-full' size="sm" onClick={() => setEditOpen(true)}>
              <Edit className="h-4 w-4 sm:hidden" />
              <span className="hidden sm:inline">Edit profile</span>
            </Button>
          ) : (
            <Button
              variant={isFollowing ? "secondary" : "default"}
              size="sm"
              onClick={handleToggleFollow}
              disabled={isFollowLoading}
              className="rounded-full"
            >
              {isFollowing ? "Following" : "Follow"}
            </Button>
          )}
        </div>

        <div className="flex items-center space-x-4 text-sm mb-6">
          <div className="flex items-center space-x-1">
            <span className={isOwnProfile ? "font-semibold text-foreground" : "font-medium"}>{user.followersCount || 0}</span>
            {isOwnProfile ? (
              <Button
                variant="link"
                className="text-muted-foreground h-auto p-0 font-normal"
                onClick={() => navigate('/profile/followers')}
              >
                Followers
              </Button>
            ) : (
              <span className="text-muted-foreground">followers</span>
            )}
          </div>
          <div className="flex items-center space-x-1">
            <span className={isOwnProfile ? "font-semibold text-foreground" : "font-medium"}>{user.followingCount || 0}</span>
            {isOwnProfile ? (
              <Button
                variant="link"
                className="text-muted-foreground h-auto p-0 font-normal"
                onClick={() => navigate('/profile/following')}
              >
                Following
              </Button>
            ) : (
              <span className="text-muted-foreground">following</span>
            )}
          </div>
        </div>

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
          <ResponsiveTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            tabs={[
              {
                id: 'posts',
                label: 'Posts',
                icon: FileText,
                content: <PostsList userId={user.id} readOnly={!isOwnProfile} />
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
