import { useParams, useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { Spinner } from "@/components/ui/spinner"
import { ProfileHeader } from "@/components/app/profile/ProfileHeader"
import { ProfileMeta } from "@/components/app/profile/ProfileMeta"
import { useAuth } from "@/hooks"
import { useUser } from "@/hooks/useAuthStore"
import { useNavigationTracking, createSmartNavigationHandler } from '@/utils/navigation'

export function UserProfile() {
  const { username } = useParams<{ username: string }>()
  const { user: currentUser } = useAuth()
  const { data: userData, isLoading, error } = useUser(username || '')
  const navigate = useNavigate()
  
  useNavigationTracking(`/${username}`)
  
  const handleBack = () => {
    const smartHandler = createSmartNavigationHandler(
      navigate,
      `/${username}`,
      '/feed'
    )
    smartHandler([])
  }
  
  if (!username) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground text-center">
          <p className="text-lg">Invalid username</p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground text-center">
          <Spinner className="mx-auto mb-4 text-primary" size="lg" />
          <p>Loading profile...</p>
        </div>
      </div>
    )
  }

  if (error || !userData?.user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground text-center">
          <h1 className="text-2xl font-bold mb-2">User not found</h1>
          <p className="text-muted-foreground mb-4">
            The user @{username} doesn't exist or has been removed.
          </p>
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
            className="mx-auto"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  const user = userData.user
  const isOwnProfile = currentUser?.id === user.id

  // If it's own profile, redirect to /profile
  if (isOwnProfile && currentUser) {
    window.location.href = '/profile'
    return null
  }

  return (
    <>
      <div className="mb-4">
        <div className="flex items-center space-x-4 mb-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="h-8 w-8 p-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-semibold text-foreground">@{username}</h1>
        </div>
      </div>
      
      <ProfileHeader
        user={{
          id: user.id,
          name: user.name,
          username: user.username,
          avatar: user.avatar,
          cover: user.cover,
          bio: user.bio,
        }}
        isOwnProfile={false}
        onEditProfile={() => {}} // Empty function - won't be called
        meta={
          <ProfileMeta
            createdAt={user.createdAt}
            followersCount={user.followersCount}
            followingCount={user.followingCount}
            userId={user.id}
            // email not passed - won't be shown
          />
        }
        // CoverEditorComponent and AvatarEditorComponent not passed - static images
      />
    </>
  )
}

export default UserProfile
