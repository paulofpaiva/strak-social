import { useLocation, Link } from "react-router"
import { useIsMobile } from "@/hooks/useIsMobile"
import { useCreatePost } from "@/contexts/CreatePostContext"
import { useScrollDirection } from "@/hooks/useScrollDirection"
import { cn } from "@/lib/utils"
import { 
  getBottomNavItems, 
  getBottomActionItems 
} from "@/config/navigation"

export function BottomNavigation() {
  const isMobile = useIsMobile()
  const location = useLocation()
  const { openCreatePost } = useCreatePost()
  const scrollDirection = useScrollDirection(10)

  const navItems = getBottomNavItems()
  const actionItems = getBottomActionItems()

  if (!isMobile) {
    return null
  }
  

  return (
    <>
      <nav className={cn(
        "fixed bottom-0 left-0 right-0 z-40 shadow-lg transition-all duration-300",
        scrollDirection === 'down'
          ? "bg-background/10 border-t border-border/20"
          : "bg-background border-t border-border"
      )}>
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = item.matchPattern === 'startsWith'
              ? location.pathname.startsWith(item.href!)
              : location.pathname === item.href
            
            return (
              <Link
                key={item.id}
                to={item.href!}
                className={cn(
                  "flex items-center justify-center p-3 rounded-lg transition-all duration-300 min-w-0 flex-1",
                  scrollDirection === 'down' && "opacity-60",
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
              </Link>
            )
          })}
          
          {actionItems.map((action) => {
            const Icon = action.icon
            const handleClick = action.action === 'create-post' ? openCreatePost : undefined
            
            return (
              <button
                key={action.id}
                onClick={handleClick}
                className={cn(
                  "flex items-center justify-center p-3 rounded-lg transition-all duration-300 min-w-0 flex-1 text-primary hover:text-primary/80",
                  scrollDirection === 'down' && "opacity-60"
                )}
                title={action.label}
              >
                <Icon className="h-6 w-6 stroke-[2.5px]" />
              </button>
            )
          })}
        </div>
      </nav>
    </>
  )
}
