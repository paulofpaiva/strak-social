import { Button } from "@/components/ui/button"
import { Avatar } from "@/components/ui/avatar"
import { useAuth } from "@/hooks"
import { useIsMobile } from "@/hooks"
import { Link, useNavigate } from "react-router-dom"
import { LogOut, User, Settings } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ResponsiveDropdown } from "@/components/ui/responsive-dropdown"

export function AppHeader() {
  const { user, logout } = useAuth()
  const isMobile = useIsMobile()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <header className="border-b bg-background">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/feed" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">S</span>
          </div>
          <h1 className="text-2xl font-bold">Strak</h1>
        </Link>
        
        <ResponsiveDropdown
          trigger={
            <div className="cursor-pointer hover:opacity-80 transition-opacity">
              <Avatar 
                src={user?.avatar} 
                name={user?.name || 'User'} 
                size="md" 
              />
            </div>
          }
          items={[
            {
              label: 'Settings',
              icon: <User className="h-4 w-4" />,
              onClick: () => navigate('/settings')
            },
            {
              label: 'Feed',
              icon: <Settings className="h-4 w-4" />,
              onClick: () => navigate('/feed')
            },
            {
              label: 'Log out',
              icon: <LogOut className="h-4 w-4" />,
              onClick: handleLogout,
              variant: 'destructive'
            }
          ]}
        />

        {isMobile && (
          <Dialog>
            <DialogTrigger asChild>
              <div className="cursor-pointer hover:opacity-80 transition-opacity">
                <Avatar 
                  src={user?.avatar} 
                  name={user?.name || 'User'} 
                  size="md" 
                />
              </div>
            </DialogTrigger>
            <DialogContent className="max-w-[400px] w-[90vw]">
              <DialogHeader>
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-sm">S</span>
                  </div>
                  <DialogTitle className="text-xl font-bold">Strak</DialogTitle>
                </div>
              </DialogHeader>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                  <Avatar 
                    src={user?.avatar} 
                    name={user?.name || 'User'} 
                    size="md" 
                  />
                  <div>
                    <p className="font-medium">{user?.name}</p>
                    <p className="text-muted-foreground text-sm">{user?.email}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button asChild variant="ghost" className="w-full justify-start h-12 text-base font-medium">
                    <Link to="/feed">
                      Feed
                    </Link>
                  </Button>
                  <Button asChild variant="ghost" className="w-full justify-start h-12 text-base font-medium">
                    <Link to="/settings">
                      Settings
                    </Link>
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start h-12 text-base font-medium text-destructive hover:bg-destructive/10"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-5 w-5 mr-3" />
                    Sign Out
                  </Button>
                </div>
              </div>
              
              <div className="pt-6 border-t">
                <p className="text-xs text-muted-foreground text-center">
                  © 2025 Strak Social
                </p>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </header>
  )
}
