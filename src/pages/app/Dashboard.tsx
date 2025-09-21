import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar } from "@/components/ui/avatar"
import { AppLayout } from "@/layouts/AppLayout"
import { useAuth } from "@/hooks"
import { User, Mail, Calendar } from "lucide-react"

export function Dashboard() {
  const { user } = useAuth()

  if (!user) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p>Loading...</p>
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Dashboard</h2>
        <p className="text-gray-400">Welcome to your control panel</p>
      </div>

      <Card className="border-gray-800 bg-gray-900 mb-8">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <User className="h-5 w-5 mr-2" />
            User Information
          </CardTitle>
          <CardDescription className="text-gray-400">
            Your account details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4 p-4 bg-gray-800 rounded-lg">
            <Avatar 
              src={user?.avatar} 
              name={user?.name || 'User'} 
              size="xl" 
            />
            <div>
              <h3 className="text-lg font-medium text-white">{user?.name}</h3>
              <p className="text-gray-400">{user?.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <Mail className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-sm text-gray-400">Email</p>
                <p className="text-white">{user?.email}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <User className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-sm text-gray-400">Name</p>
                <p className="text-white">{user?.name}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Calendar className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-sm text-gray-400">Member since</p>
                <p className="text-white">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US') : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-gray-800 bg-gray-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-lg">Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-white">0</p>
            <p className="text-sm text-gray-400">Posts created</p>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-gray-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-lg">Followers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-white">0</p>
            <p className="text-sm text-gray-400">People following you</p>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-gray-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-lg">Following</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-white">0</p>
            <p className="text-sm text-gray-400">People you follow</p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
