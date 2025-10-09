import { Sparkles } from "lucide-react"
import { useNavigationTracking } from '@/utils/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FollowingFeed } from './components/FollowingFeed'
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyMedia } from '@/components/ui/empty'

export function Feed() {
  useNavigationTracking('/feed')

  return (
    <Tabs defaultValue="following" className="w-full">
        <TabsList>
          <TabsTrigger value="following" className="cursor-pointer">
            Following
          </TabsTrigger>
          <TabsTrigger value="for-you" className="cursor-pointer">
            <Sparkles className="h-4 w-4" />
            For You
          </TabsTrigger>
        </TabsList>
        <TabsContent value="following">
          <FollowingFeed />
        </TabsContent>
        <TabsContent value="for-you">
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
        </TabsContent>
    </Tabs>
  )
}
