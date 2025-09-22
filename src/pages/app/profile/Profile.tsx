import { Button } from "@/components/ui/button"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { formatDateForInput } from "@/utils/formatting"
import { useAuth } from "@/hooks"
import { useIsMobile } from "@/hooks/useIsMobile"
import { EditProfileModal } from "./components/EditProfileModal"
import { AvatarEditor } from "./components/AvatarEditor"
import { CoverEditor } from "./components/CoverEditor"
import { ProfileTabs } from "@/pages/app/profile/components/ProfileTabs"
import { UserPosts } from "@/pages/app/profile/components/UserPosts"
import { Mail, Calendar, Edit } from "lucide-react"
import { useState } from "react"

export function Profile() {
  const { user } = useAuth()
  const isMobile = useIsMobile()
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('posts')

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="mb-4">
        <div className="flex items-center space-x-4 mb-3">
          <Breadcrumb to="/dashboard" label="Back" className="h-12 px-6 text-base" />
        </div>
      </div>
      
      <div className="relative border border-border rounded-lg overflow-hidden">
        <CoverEditor cover={user.cover} />

        <div className="relative px-6 pb-4">
          <div className="relative -mt-16 mb-4">
            <AvatarEditor avatar={user.avatar} name={user.name} />
          </div>

          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  {user.name || 'No name set'}
                </h1>
                <p className="text-muted-foreground">@{user.username}</p>
                {user.bio && (
                  <p className="text-foreground mt-2 leading-relaxed">
                    {user.bio}
                  </p>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditModalOpen(true)}
                className="mt-1 rounded-full p-4"
                title="Edit Profile"
              >
                <Edit className={`h-4 w-4 ${!isMobile ? 'mr-2' : ''}`} />
                {!isMobile && "Edit Profile"}
              </Button>
            </div>

            <div className="flex space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <span className="font-semibold text-foreground">
                  {user.followersCount || 0}
                </span>
                <span className="text-muted-foreground">
                  {user.followersCount === 1 ? 'follower' : 'followers'}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="font-semibold text-foreground">
                  {user.followingCount || 0}
                </span>
                <span className="text-muted-foreground">following</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span className="text-sm">{user.email}</span>
              </div>

              <div className="flex items-center space-x-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">
                  Joined {new Date(user.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <ProfileTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        
        <div className="mt-4">
          {activeTab === 'posts' && user.id && (
            <UserPosts userId={user.id} />
          )}
          {activeTab === 'likes' && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Likes coming soon</p>
            </div>
          )}
          {activeTab === 'comments' && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Comments coming soon</p>
            </div>
          )}
        </div>
      </div>

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
