import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "@/hooks"
import { useTheme } from "@/contexts/ThemeContext"
import { Avatar } from "@/components/ui/avatar"
import { MoreHorizontal } from "lucide-react"
import { ResponsiveDropdown } from "@/components/ui/responsive-dropdown"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { VisuallyHidden } from "@/components/ui/visually-hidden"
import { 
  getMobileSidebarItems, 
  getUserMenuItemsForDesktop
} from "@/config/navigation"
import { cn } from "@/lib/utils"
import { useLocation } from "react-router"

interface MobileSidebarProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MobileSidebar({ open, onOpenChange }: MobileSidebarProps) {
  const { user, logout } = useAuth()
  const { resolvedTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()

  const menuItems = getMobileSidebarItems()
  const userMenuActions = getUserMenuItemsForDesktop()
  

  const handleUserAction = async (action?: string, href?: string) => {
    if (action === 'logout') {
      try {
        await logout()
        navigate('/')
      } catch (error) {
        console.error('Logout error:', error)
      }
    } else if (href) {
      navigate(href)
    }
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-[280px] p-0 bg-background border-border text-foreground">
        <SheetHeader className="pt-4 bg-background">
          <VisuallyHidden>
            <SheetTitle>Navigation Menu</SheetTitle>
            <SheetDescription>
              Access your profile and navigate through the app
            </SheetDescription>
          </VisuallyHidden>
        {user && (
            <div className="flex flex-col items-start p-6">
              <Avatar 
                src={user.avatar} 
                name={user.name || 'User'} 
                size="lg" 
                className="mb-3"
              />
              <p className="font-semibold text-lg text-left">{user.name}</p>
              <p className="text-sm text-muted-foreground text-left">
                @{user.username?.split('@')[0]}
              </p>
            </div>
          )}
        </SheetHeader>
        <div className="flex flex-col h-[calc(100%-88px)] bg-background">
          <nav className="flex-1 px-4 py-0 space-y-1 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon
              const href = item.id === 'profile' && user ? `/${user.username}` : item.href!
              const isActive = item.matchPattern === 'startsWith'
                ? location.pathname.startsWith(href)
                : location.pathname === href

              return (
                <Link
                  key={item.id}
                  to={href}
                  onClick={() => onOpenChange(false)}
                  className={cn(
                    "flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors text-left",
                    isActive
                      ? "bg-primary text-primary-foreground font-semibold"
                      : "text-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {item.showLabel && (
                    <span className="text-base">{item.label}</span>
                  )}
                </Link>
              )
            })}
            
          </nav>

          {/* User Footer - igual ao FeedSidebar */}
          {user && (
            <div className="border-t border-border p-4">
              <ResponsiveDropdown
                trigger={
                  <button 
                    className="flex items-center space-x-3 p-3 text-left cursor-pointer transition-colors w-full hover:bg-accent hover:text-accent-foreground rounded-lg"
                  >
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
                        @{user.username?.split('@')[0]}
                      </p>
                    </div>
                    <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                  </button>
                }
                items={userMenuActions.map(action => {
                  const Icon = action.icon
                  const href = action.id === 'profile' && user ? `/${user.username}` : action.href
                  return {
                    label: action.label,
                    icon: <Icon className="h-4 w-4" />,
                    href: href,
                    onClick: () => handleUserAction(action.action, href),
                    variant: action.variant
                  }
                })}
              />
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

