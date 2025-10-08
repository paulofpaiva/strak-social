import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { getProfileApi } from '@/api/profile'
import { formatDate } from '@/utils/date'
import { AvatarEditor } from '@/pages/app/Profile/components/AvatarEditor'
import { CoverEditor } from '@/pages/app/Profile/components/CoverEditor'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Calendar, 
  Camera,
  MapPin,
  Link as LinkIcon,
  Edit,
  CheckCircle,
  FileText,
  MessageSquare,
  Image as ImageIcon,
  Heart
} from 'lucide-react'
import { ProfileSkeleton } from './components/ProfileSkeleton'
import { ErrorEmpty } from '@/components/ErrorEmpty'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { EditProfile } from '@/pages/app/Profile/components/EditProfile'
import { ResponsiveTabs } from '@/components/ui/responsive-tabs-sidebar'
import { PostsList } from '@/components/post/PostsList'
import { useState } from 'react'

export function Profile() {
  const [editOpen, setEditOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('posts')
  const navigate = useNavigate()
  const { data: profileData, isLoading, error, refetch } = useQuery({
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
        onRetry={() => refetch()}
        retryText="Try again"
      />
    )
  }

  return (
    <div className="container mx-auto overflow-x-hidden">
      <Breadcrumb to="/feed" label={`${user.username}`} />
      <div className="relative mt-8 -mx-4 sm:mx-0">
        <CoverEditor 
          src={user.cover} 
          className="h-32 sm:h-48 md:h-64 w-full"
        />
        
        <div className="absolute -bottom-12 sm:-bottom-16 left-4 sm:left-6">
          <AvatarEditor 
            src={user.avatar} 
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
              <div className="flex items-center">
                <Badge variant="outline" className="text-xs hidden sm:inline-flex">
                  Get verified
                </Badge>
                <div className="sm:hidden">
                  <Button variant="outline" size="icon" className="h-6 w-6 rounded-full">
                    <CheckCircle className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
            <p className="text-muted-foreground">@{user.username}</p>
            {user.bio && (
              <p className="text-foreground text-sm pt-2">{user.bio}</p>
            )}
            {(user.location || user.website || user.createdAt) && (
              <div className="flex flex-wrap items-center gap-4 gap-y-2 pt-2 text-sm">
                {user.location && (
                  <div className="text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{user.location}</span>
                  </div>
                )}
                {user.website && (
                  <div className="flex items-center gap-1">
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
                  <div className="text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Joined {formatDate(user.createdAt)}</span>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <Button variant="outline" className='rounded-full' size="sm" onClick={() => setEditOpen(true)}>
            <Edit className="h-4 w-4 sm:hidden" />
            <span className="hidden sm:inline">Edit profile</span>
          </Button>
        </div>
        <div className="flex items-center space-x-4 text-sm mb-6">
          <div className="flex items-center space-x-1">
            <span className="font-semibold text-foreground">{user.followersCount || 0}</span>
            <Button
              variant="link"
              className="text-muted-foreground h-auto p-0 font-normal"
              onClick={() => navigate('/profile/followers')}
            >
              Followers
            </Button>
          </div>
          <div className="flex items-center space-x-1">
            <span className="font-semibold text-foreground">{user.followingCount || 0}</span>
            <Button
              variant="link"
              className="text-muted-foreground h-auto p-0 font-normal"
              onClick={() => navigate('/profile/following')}
            >
              Following
            </Button>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="mt-6">
          <ResponsiveTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            tabs={[
              {
                id: 'posts',
                label: 'Posts',
                icon: FileText,
                content: <PostsList userId={user.id} />
              },
              {
                id: 'replies',
                label: 'Replies',
                icon: MessageSquare,
                content: (
                  <div className="py-12 text-center">
                    <p className="text-muted-foreground">Soon</p>
                  </div>
                )
              },
              {
                id: 'media',
                label: 'Media',
                icon: ImageIcon,
                content: (
                  <div className="py-12 text-center">
                    <p className="text-muted-foreground">Soon</p>
                  </div>
                )
              },
              {
                id: 'likes',
                label: 'Likes',
                icon: Heart,
                content: (
                  <div className="py-12 text-center">
                    <p className="text-muted-foreground">Soon</p>
                  </div>
                )
              }
            ]}
          />
        </div>
      </div>

      <EditProfile 
        open={editOpen}
        onOpenChange={setEditOpen}
        defaultValues={{
          bio: user.bio ?? '',
          location: user.location ?? '',
          website: user.website ?? '',
        }}
      />
    </div>
  )
}
