import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { Search } from "lucide-react"

export function Explore() {
  return (
    <>
      <div className="mb-4">
        <div className="flex items-center space-x-4 mb-3">
          <Breadcrumb to="/dashboard" label="Back" className="h-12 px-6 text-base" />
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Explore</h2>
        <p className="text-muted-foreground">Discover new content and connect with others</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="h-5 w-5 mr-2" />
            Explore Content
          </CardTitle>
          <CardDescription>
            Find interesting posts, users, and communities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Coming Soon</h3>
            <p className="text-muted-foreground">
              The explore feature is under development. Stay tuned for exciting content discovery tools!
            </p>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
