import { useQuery } from '@tanstack/react-query'
import { useParams, useNavigate } from 'react-router-dom'
import { getUserByUsernameApi } from '@/api/users'
import { formatDate } from '@/utils/date'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Calendar, 
  ArrowLeft,
  Users,
  UserPlus
} from 'lucide-react'
import { ErrorEmpty } from '@/components/ErrorEmpty'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { UserProfileSkeleton } from './components/UserProfileSkeleton'
import { useAuth } from '@/hooks'
import { toggleFollowApi } from '@/api/follow'
import { useQueryClient } from '@tanstack/react-query'
import { useToastContext } from '@/contexts/ToastContext'
import { useState, useEffect } from 'react'

export function UserProfile() {
  const { username } = useParams<{ username: string }>()
  const navigate = useNavigate()
  const { user: currentUser } = useAuth()
  const queryClient = useQueryClient()
  const { error: showError, success: showSuccess } = useToastContext()
  const [isFollowing, setIsFollowing] = useState(false)
  const [isFollowLoading, setIsFollowLoading] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)

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
      
      showSuccess(isFollowing ? 'Unfollowed successfully' : 'Following successfully')
    } catch (error) {
      console.error('Failed to toggle follow:', error)
      showError(error instanceof Error ? error.message : 'Failed to update follow status. Please try again.')
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
    <div className="container mx-auto">
      <Breadcrumb to="/explore" label={`${user.username}`} />
      
      <div className="relative mt-8">
        <div className="h-64 w-full bg-gray-800 rounded-lg overflow-hidden relative">
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
              <span className="text-gray-500 text-sm">No cover image</span>
            </div>
          )}
        </div>
        
        <div className="absolute -bottom-16 left-6">
          <Avatar 
            src={user.avatar ?? undefined} 
            name={user.name} 
            size="2xl"
            className="w-40 h-40 border-4 border-background"
          />
        </div>
      </div>

      <div className="mt-20 px-4">
        <div className="flex items-start justify-between mb-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-foreground">{user.name}</h1>
              <Badge variant="outline" className="text-xs">
                {user.username}
              </Badge>
            </div>
            <p className="text-muted-foreground">@{user.username}</p>
            {user.bio && (
              <p className="text-foreground text-sm mt-2">{user.bio}</p>
            )}
          </div>
          
          {!isOwnProfile && (
            <Button 
              variant={isFollowing ? "outline" : "default"} 
              size="sm"
              onClick={handleToggleFollow}
              disabled={isFollowLoading}
              className="flex items-center gap-2"
            >
              <UserPlus className="h-4 w-4" />
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
        <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>Joined {formatDate(user.createdAt)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
