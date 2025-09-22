import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { formatDateForInput } from "@/utils/formatting"
import { useAuth } from "@/hooks"
import { EditProfileModal } from "../../../components/profile/EditProfileModal"
import { AvatarEditor } from "../../../components/profile/AvatarEditor"
import { CoverEditor } from "../../../components/profile/CoverEditor"
import type { } from "@/components/profile/ProfileTabs"
import { Spinner } from "@/components/ui/spinner"
import { ProfileHeader } from "@/components/profile/ProfileHeader"
import { ProfileMeta } from "@/components/profile/ProfileMeta"
import { useState } from "react"

export function Profile() {
  const { user } = useAuth()
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const navigate = useNavigate()
  

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
            onClick={() => navigate(-1)}
            className="h-12 px-6 text-base"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
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
