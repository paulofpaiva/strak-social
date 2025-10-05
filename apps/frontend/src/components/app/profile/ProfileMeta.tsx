import { Mail, Calendar } from "lucide-react"
import { ProfileTabs } from "@/components/app/profile/ProfileTabs"
import { UserPosts } from "@/components/app/profile/UserPosts"
import { useState } from "react"
import { useAuth } from "@/hooks"

interface ProfileMetaProps {
  email?: string
  createdAt: string
  followersCount?: number
  followingCount?: number
  userId: string
}

export function ProfileMeta({ email, createdAt, followersCount = 0, followingCount = 0, userId }: ProfileMetaProps) {
  const { user: currentUser } = useAuth()
  const [activeTab, setActiveTab] = useState<'posts' | 'likes' | 'comments'>('posts')
  const isOwnProfile = currentUser?.id === userId
  
  return (
    <div className="space-y-2">
      <div className="flex space-x-4 text-sm">
        <div className="flex items-center space-x-1">
          <span className="font-semibold text-foreground">{followersCount}</span>
          <span className="text-muted-foreground">{followersCount === 1 ? 'follower' : 'followers'}</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="font-semibold text-foreground">{followingCount}</span>
          <span className="text-muted-foreground">following</span>
        </div>
      </div>

      {isOwnProfile && email && (
        <div className="flex items-center space-x-2 text-muted-foreground">
          <Mail className="h-4 w-4" />
          <span className="text-sm">{email}</span>
        </div>
      )}

      <div className="flex items-center space-x-2 text-muted-foreground">
        <Calendar className="h-4 w-4" />
        <span className="text-sm">
          Joined {new Date(createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </span>
      </div>

      <div className="mt-6">
        <ProfileTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        <div className="mt-4">
          {activeTab === 'posts' && userId && (
            <UserPosts userId={userId} />
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
    </div>
  )
}


