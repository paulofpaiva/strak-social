import { TrendingUp } from "lucide-react"
import { useNavigationTracking } from '@/utils/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FollowingFeed } from './components/FollowingFeed'
import { TrendingFeed } from './components/TrendingFeed'

export function Feed() {
  useNavigationTracking('/feed')

  return (
    <Tabs defaultValue="following" className="w-full">
        <TabsList>
          <TabsTrigger value="following" className="cursor-pointer">
            Following
          </TabsTrigger>
          <TabsTrigger value="trending" className="cursor-pointer">
            <TrendingUp className="h-4 w-4" />
            Trending
          </TabsTrigger>
        </TabsList>
        <TabsContent value="following">
          <FollowingFeed />
        </TabsContent>
        <TabsContent value="trending">
          <TrendingFeed />
        </TabsContent>
    </Tabs>
  )
}
