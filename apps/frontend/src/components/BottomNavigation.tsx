import { useNavigate, useLocation } from "react-router"
import { Home, Search, User, Settings, Plus } from "lucide-react"
import { useIsMobile } from "@/hooks/useIsMobile"
import { cn } from "@/lib/utils"

interface NavItem {
  id: string
  label: string
  icon: any
  href: string
}

const navItems: NavItem[] = [
  {
    id: 'home',
    label: 'Home',
    icon: Home,
    href: '/feed'
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

export function BottomNavigation() {
  const isMobile = useIsMobile()
  const navigate = useNavigate()
  const location = useLocation()

  if (!isMobile) {
    return null
  }

  const handleItemClick = (href: string) => {
    navigate(href)
  }

  const handleCreatePost = () => {
    console.log('Create Post Modal opened')
  }

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-[100] shadow-lg">
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.href
            
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.href)}
                className={cn(
                  "flex items-center justify-center p-3 rounded-lg transition-colors min-w-0 flex-1",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
                title={item.label}
              >
                <Icon className={cn(
                  "h-6 w-6",
                  isActive && "stroke-[2.5px]"
                )} />
              </button>
            )
          })}
          
          <button
            onClick={handleCreatePost}
            className="flex items-center justify-center p-3 rounded-lg transition-colors min-w-0 flex-1 text-primary hover:text-primary/80"
            title="Create Post"
          >
            <Plus className="h-6 w-6 stroke-[2.5px]" />
          </button>
        </div>
      </nav>
    </>
  )
}
