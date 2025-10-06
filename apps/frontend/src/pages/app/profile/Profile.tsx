import { useQuery } from '@tanstack/react-query'
import { getProfileApi } from '@/api/profile'
import { formatDate } from '@/utils/date'
import { AvatarEditor } from '@/pages/app/Profile/components/AvatarEditor'
import { CoverEditor } from '@/pages/app/Profile/components/CoverEditor'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Calendar, 
  Camera
} from 'lucide-react'
import { ProfileSkeleton } from './components/ProfileSkeleton'
import { ErrorEmpty } from '@/components/ErrorEmpty'
import { Breadcrumb } from '@/components/ui/breadcrumb'

export function Profile() {
  const { data: profileData, isLoading, error } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfileApi,
    retry: false,
    refetchOnWindowFocus: false,
  })

  const user = profileData?.user

  if (isLoading) {
    return <ProfileSkeleton />
  }

  if (error || !profileData) {
    return (
      <ErrorEmpty
        title="Failed to load profile"
        description="Unable to load profile information. Please check your connection and try again."
        onRetry={() => window.location.reload()}
        retryText="Try again"
      />
    )
  }

  return (
    <div className="container mx-auto">
      <Breadcrumb to="/feed" label={`${user.username}`} />
      <div className="relative mt-8">
        <CoverEditor 
          src={user.cover} 
          className="h-64 w-full"
        />
        
        <div className="absolute -bottom-16 left-6">
          <AvatarEditor 
            src={user.avatar} 
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
                Get verified
              </Badge>
            </div>
            <p className="text-muted-foreground">@{user.username}</p>
            {user.bio && (
              <p className="text-foreground text-sm">{user.bio}</p>
            )}
          </div>
          
          <Button variant="outline" size="sm">
            Edit profile
          </Button>
        </div>

        {/* Stats */}
        <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>Joined {formatDate(user.createdAt)}</span>
          </div>
        </div>

        {/* Follow Stats */}
        <div className="flex items-center space-x-4 text-sm mb-6">
          <div className="flex items-center space-x-1">
            <span className="font-semibold text-foreground">{user.followingCount || 0}</span>
            <span className="text-muted-foreground">Following</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="font-semibold text-foreground">{user.followersCount || 0}</span>
            <span className="text-muted-foreground">Followers</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-border">
          <nav className="flex space-x-8">
            {['Posts', 'Replies', 'Highlights', 'Articles', 'Media', 'Likes'].map((tab) => (
              <button
                key={tab}
                className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                  tab === 'Posts' 
                    ? 'border-primary text-foreground' 
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="py-8 text-center">
          <p className="text-muted-foreground">No posts yet</p>
        </div>
      </div>
    </div>
  )
}
