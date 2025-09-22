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
import { useCreatePost } from '@/contexts/CreatePostContext'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { ResponsiveDropdown } from '@/components/ui/responsive-dropdown'
import { useNavigate, useLocation } from 'react-router'

interface FeedItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  href?: string
}

interface FeedSidebarProps {
  isCompact?: boolean
}

const feedItems: FeedItem[] = [
  {
    id: 'home',
    label: 'Home',
    icon: Home,
    href: '/feed'
  },
  {
    id: 'explore',
    label: 'Explore',
    icon: Search,
    href: '/explore'
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: User,
    href: '/profile'
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    href: '/settings'
  }
]

export function FeedSidebar({ isCompact = false }: FeedSidebarProps) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const { openModal } = useCreatePost()

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const handleProfileClick = () => {
    navigate('/profile')
  }

  const handleItemClick = (href: string) => {
    navigate(href)
  }

  const handleCreatePost = () => {
    openModal()
  }

  return (
    <div className={cn("flex flex-col h-full", isCompact && "w-16")}>
      <div className={cn("flex items-center justify-center", isCompact ? "p-4" : "p-6")}>
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-lg">S</span>
        </div>
      </div>

      <nav className={cn("flex-1 space-y-1", isCompact ? "px-2" : "px-4")}>
        {feedItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.href
          
          return (
            <button
              key={item.id}
              onClick={() => item.href && handleItemClick(item.href)}
              className={cn(
                "flex items-center w-full text-left rounded-full transition-colors cursor-pointer",
                isCompact ? "justify-center px-2 py-3" : "px-4 py-3",
                isActive
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "text-foreground hover:bg-accent hover:text-accent-foreground"
              )}
              title={isCompact ? item.label : undefined}
            >
              <Icon className={cn("h-6 w-6", !isCompact && "mr-4")} />
              {!isCompact && <span className="text-lg">{item.label}</span>}
            </button>
          )
        })}
      </nav>

      <div className={cn("", isCompact ? "p-2" : "p-4")}>
        <Button 
          onClick={handleCreatePost}
          className={cn(
            "w-full h-12 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold",
            isCompact && "justify-center"
          )}
          title={isCompact ? "Post" : undefined}
        >
          <Plus className={cn("h-5 w-5", !isCompact && "mr-2")} />
          {!isCompact && "Post"}
        </Button>
      </div>

      {user && (
        <div className={cn("border-t border-border", isCompact ? "p-2" : "p-4")}>
          <ResponsiveDropdown
            trigger={
              <button 
                className={cn(
                  "flex items-center rounded-full hover:bg-accent cursor-pointer transition-colors w-full",
                  isCompact ? "justify-center p-2" : "space-x-3 p-3 text-left"
                )}
                title={isCompact ? user.name : undefined}
              >
                <Avatar 
                  src={user.avatar} 
                  name={user.name || 'User'} 
                  size="sm" 
                />
                {!isCompact && (
                  <>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        @{user.email?.split('@')[0]}
                      </p>
                    </div>
                    <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                  </>
                )}
              </button>
            }
            items={[
              {
                label: 'Profile',
                icon: <User className="h-4 w-4" />,
                onClick: handleProfileClick
              },
              {
                label: 'Settings',
                icon: <Settings className="h-4 w-4" />,
                onClick: () => navigate('/settings')
              },
              {
                label: 'Log out',
                icon: <LogOut className="h-4 w-4" />,
                onClick: handleLogout,
                variant: 'destructive'
              }
            ]}
          />
        </div>
      )}
    </div>
  )
}
