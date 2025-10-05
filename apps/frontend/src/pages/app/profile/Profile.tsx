import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { formatDateForInput } from "@/utils/formatting"
import { useAuth } from "@/hooks"
import { useNavigationTracking, createSmartNavigationHandler } from '@/utils/navigation'
import { EditProfileModal } from "../../../components/app/profile/EditProfileModal"
import { AvatarEditor } from "../../../components/app/profile/AvatarEditor"
import { CoverEditor } from "../../../components/app/profile/CoverEditor"
import type { } from "@/components/app/profile/ProfileTabs"
import { Spinner } from "@/components/ui/spinner"
import { ProfileHeader } from "@/components/app/profile/ProfileHeader"
import { ProfileMeta } from "@/components/app/profile/ProfileMeta"
import { useState } from "react"

export function Profile() {
  const { user } = useAuth()
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const navigate = useNavigate()
  
  useNavigationTracking('/profile')
  
  const handleBack = () => {
    const smartHandler = createSmartNavigationHandler(
      navigate,
      '/profile',
      '/feed'
    )
    smartHandler([])
  }
  

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground text-center">
          <Spinner className="mx-auto mb-4 text-primary" size="lg" />
          <p>Loading...</p>
        </div>
      </div>
    )
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
          <h1 className="text-xl font-semibold text-foreground">Profile</h1>
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
        isOwnProfile={true}
        onEditProfile={() => setIsEditModalOpen(true)}
        CoverEditorComponent={<CoverEditor cover={user.cover} />}
        AvatarEditorComponent={<AvatarEditor avatar={user.avatar} name={user.name} />}
        meta={
          <ProfileMeta
            email={user.email}
            createdAt={user.createdAt}
            followersCount={user.followersCount}
            followingCount={user.followingCount}
            userId={user.id}
          />
        }
      />

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        currentUser={{
          name: user.name || '',
          bio: user.bio || '',
          birthDate: formatDateForInput(user.birthDate),
          username: user.username || ''
        }}
      />
    </>
  )
}
