import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { VisuallyHidden } from "@/components/ui/visually-hidden"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar } from "@/components/ui/avatar"
import { Menu, User, Settings, LogOut } from "lucide-react"
import { useIsMobile, useAuth } from "@/hooks"
import { Link, useNavigate } from "react-router"
import StrakLogoBlack from '/Strak_Logo_Black.png'
import StrakLogoWhite from '/Strak_Logo_White.png'
import { useTheme } from '@/contexts/ThemeContext'

export function Header() {
  const isMobile = useIsMobile()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { resolvedTheme } = useTheme()

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const handleFeedClick = () => {
    navigate('/feed')
  }

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <img 
            src={resolvedTheme === 'dark' ? StrakLogoWhite : StrakLogoBlack} 
            alt="Strak Social" 
            className="h-10 w-auto object-contain"
          />
        </div>
        
        {user ? (
          <div className="flex items-center space-x-4">
            {!isMobile && (
              <Button onClick={handleFeedClick} variant="ghost">
                Feed
              </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center space-x-2 p-2 rounded-full hover:bg-accent cursor-pointer transition-colors">
                  <Avatar 
                    src={user.avatar} 
                    name={user.name || 'User'} 
                    size="sm" 
                  />
                  {!isMobile && (
                    <span className="text-sm font-medium">{user.name}</span>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={handleFeedClick}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Feed</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          /* Unauthenticated User */
          <>
            {!isMobile && (
              <div className="flex items-center space-x-4">
                <Button asChild variant="ghost">
                  <Link to="/auth/sign-in">
                    Sign In
                  </Link>
                </Button>
                <Button asChild>
                  <Link to="/auth/sign-up">
                    Sign Up
                  </Link>
                </Button>
              </div>
            )}

            {isMobile && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[400px] w-[90vw]">
                  <DialogHeader>
                    <VisuallyHidden>
                      <DialogTitle>Navigation Menu</DialogTitle>
                      <DialogDescription>
                        Sign in or sign up to access Strak Social
                      </DialogDescription>
                    </VisuallyHidden>
                    <div className="flex items-center mb-2">
                      <img 
                        src={resolvedTheme === 'dark' ? StrakLogoWhite : StrakLogoBlack} 
                        alt="Strak Social" 
                        className="h-10 w-auto object-contain"
                      />
                    </div>
                  </DialogHeader>
                  
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <Button asChild variant="ghost" className="w-full justify-start h-12 text-base font-medium">
                        <Link to="/auth/sign-in">
                          Sign In
                        </Link>
                      </Button>
                      <Button asChild className="w-full justify-start h-12 text-base font-medium">
                        <Link to="/auth/sign-up">
                          Sign Up
                        </Link>
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
          </>
        )}
      </div>
    </header>
  )
}
