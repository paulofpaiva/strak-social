import { cn } from '@/lib/utils'
import { 
  Home,
  Search, 
  Settings, 
  User,
  MoreHorizontal,
  Plus,
  LogOut
} from 'lucide-react'
import { useAuth } from '@/hooks'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useNavigate, useLocation } from 'react-router'

interface FeedItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  href?: string
}

const feedItems: FeedItem[] = [
  {
    id: 'home',
    label: 'Home',
    icon: Home,
    href: '/dashboard'
  },
  {
    id: 'explore',
    label: 'Explore',
    icon: Search,
    href: '/explore'
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    href: '/settings'
  }
]

export function FeedSidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const handleProfileClick = () => {
    navigate('/settings')
  }

  const handleItemClick = (href: string) => {
    navigate(href)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-center p-6">
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-lg">S</span>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-4 space-y-1">
        {feedItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.href
          
          return (
            <button
              key={item.id}
              onClick={() => item.href && handleItemClick(item.href)}
              className={cn(
                "flex items-center w-full px-4 py-3 text-left rounded-full transition-colors cursor-pointer",
                isActive
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "text-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="mr-4 h-6 w-6" />
              <span className="text-lg">{item.label}</span>
            </button>
          )
        })}
      </nav>

      <div className="p-4">
        <Button className="w-full h-12 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold">
          <Plus className="mr-2 h-5 w-5" />
          Post
        </Button>
      </div>

      {user && (
        <div className="p-4 border-t border-border">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center space-x-3 p-3 rounded-full hover:bg-accent cursor-pointer transition-colors w-full text-left">
                <Avatar 
                  src={user.avatar} 
                  name={user.name || 'User'} 
                  size="sm" 
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    @{user.email?.split('@')[0]}
                  </p>
                </div>
                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={handleProfileClick}>
                <User className="mr-2 h-4 w-4" />
                <span>Settings</span>
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
      )}
    </div>
  )
}
