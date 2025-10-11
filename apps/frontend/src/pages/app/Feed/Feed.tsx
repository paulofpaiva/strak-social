import { useNavigationTracking } from '@/utils/navigation'
import { useSearchParams } from 'react-router-dom'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FollowingFeed } from './components/FollowingFeed'
import { RecommendedFeed } from './components/RecommendedFeed'

export function Feed() {
  useNavigationTracking('/feed')
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = searchParams.get('tab') || 'following'

  const handleTabChange = (value: string) => {
    if (value === 'following') {
      searchParams.delete('tab')
      setSearchParams(searchParams)
    } else {
      setSearchParams({ tab: value })
    }
  }

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList>
          <TabsTrigger value="following" className="cursor-pointer">
            Following
          </TabsTrigger>
          <TabsTrigger value="recommended" className="cursor-pointer">
            Recommended
          </TabsTrigger>
        </TabsList>
        <TabsContent value="following">
          <FollowingFeed />
        </TabsContent>
        <TabsContent value="recommended">
          <RecommendedFeed />
        </TabsContent>
    </Tabs>
  )
}
