import { useAuth } from "@/hooks"
import { Users, Sparkles } from "lucide-react"
import { useNavigationTracking } from '@/utils/navigation'
import { ScrollableTabs } from '@/components/ui/scrollable-tabs'
import { FollowingFeed } from './Feed/components/FollowingFeed'
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyMedia } from '@/components/ui/empty'

export function Feed() {
  const { user } = useAuth()
  
  useNavigationTracking('/feed')

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
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Feed</h2>
        <p className="text-muted-foreground">Explore posts from people you follow</p>
      </div>

      <ScrollableTabs
        defaultIndex={0}
        tabs={[
          {
            id: 'following',
            label: 'Following',
            icon: Users,
            content: <FollowingFeed />
          },
          {
            id: 'for-you',
            label: 'For You',
            icon: Sparkles,
            content: (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <Sparkles className="h-6 w-6" />
                  </EmptyMedia>
                  <EmptyTitle>Coming Soon</EmptyTitle>
                  <EmptyDescription>
                    The For You feed is currently under development. Stay tuned!
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            )
          }
        ]}
      />
    </>
  )
}
