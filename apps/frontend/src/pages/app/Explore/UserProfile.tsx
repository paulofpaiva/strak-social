import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { getUserByUsernameApi } from '@/api/users'
import { formatDate } from '@/utils/date'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Calendar, 
  ArrowLeft,
  Users,
  UserPlus,
  MapPin,
  Link as LinkIcon
} from 'lucide-react'
import { ErrorEmpty } from '@/components/ErrorEmpty'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { UserProfileSkeleton } from './components/UserProfileSkeleton'
import { useAuth, useSearchNavigation } from '@/hooks'
import { toggleFollowApi } from '@/api/follow'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useState, useEffect } from 'react'

export function UserProfile() {
  const { username } = useParams<{ username: string }>()
  const { user: currentUser } = useAuth()
  const queryClient = useQueryClient()
  const [isFollowing, setIsFollowing] = useState(false)
  const [isFollowLoading, setIsFollowLoading] = useState(false)
  const [imageLoading, setImageLoading] = useState(false)
  const { getReturnUrl } = useSearchNavigation({
    basePath: '/explore',
    defaultReturnPath: '/explore'
  })

  const { data: user, isLoading, error, refetch } = useQuery({
    queryKey: ['user-profile', username],
    queryFn: () => getUserByUsernameApi(username!),
    enabled: !!username,
    retry: false,
    refetchOnWindowFocus: false,
  })

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
    if (!user) return
    
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
    return <UserProfileSkeleton />
  }

  if (error || !user) {
    return (
      <div className="container mx-auto">
        <ErrorEmpty
          title="User not found"
          description="The user you're looking for doesn't exist or may have been removed."
          onRetry={() => refetch()}
          retryText="Try again"
        />
      </div>
    )
  }

  const isOwnProfile = currentUser?.id === user.id

  return (
    <div className="container mx-auto overflow-x-hidden">
      <Breadcrumb to={getReturnUrl()} label={`${user.username}`} />
      
      <div className="relative mt-8 -mx-4 sm:mx-0">
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
        
        <div className="absolute -bottom-12 sm:-bottom-16 left-4 sm:left-6">
          <Avatar 
            src={user.avatar ?? undefined} 
            name={user.name} 
            size="2xl"
            className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 border-4 border-background"
          />
        </div>
      </div>

      <div className="mt-14 sm:mt-20 px-4">
        <div className="flex items-start justify-between mb-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-foreground">{user.name}</h1>
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
          
          {!isOwnProfile && (
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
            <span className="font-medium">{user.followersCount}</span>
            <span className="text-muted-foreground">followers</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="font-medium">{user.followingCount}</span>
            <span className="text-muted-foreground">following</span>
          </div>
        </div>
        
      </div>
    </div>
  )
}
