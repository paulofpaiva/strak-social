import { Breadcrumb } from "@/components/ui/breadcrumb"
import { UserSearch } from "@/components/search/UserSearch"

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

      <UserSearch />
    </>
  )
}
