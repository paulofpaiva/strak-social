import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { UserSearch } from "@/components/app/search/UserSearch"
import { useNavigationTracking, createSmartNavigationHandler } from '@/utils/navigation'

export function Explore() {
  const navigate = useNavigate()
  
  useNavigationTracking('/explore')
  
  const handleBack = () => {
    const smartHandler = createSmartNavigationHandler(
      navigate,
      '/explore',
      '/feed'
    )
    smartHandler([])
  }
  
  return (
    <>
      <div className="mb-4">
        <div className="flex items-center space-x-4 mb-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="h-8 w-8 p-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-semibold text-foreground">Explore</h1>
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
