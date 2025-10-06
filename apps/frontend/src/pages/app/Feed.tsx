import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar } from "@/components/ui/avatar"
import { useAuth } from "@/hooks"
import { User, Mail, Calendar } from "lucide-react"
import { useNavigationTracking } from '@/utils/navigation'

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
        <p className="text-muted-foreground">Welcome to your control panel</p>
      </div>

    </>
  )
}
