import { Avatar } from "@/components/ui/avatar"
import { useAuth } from "@/hooks"
import { useTheme } from "@/contexts/ThemeContext"
import { MobileSidebar } from "@/components/MobileSidebar"
import { useScrollDirection } from "@/hooks/useScrollDirection"
import { cn } from "@/lib/utils"
import StrakLogoBlack from '/Strak_Logo_Black.png'
import StrakLogoWhite from '/Strak_Logo_White.png'
import { useState } from "react"

export function AppHeader() {
  const { user } = useAuth()
  const { resolvedTheme } = useTheme()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const scrollDirection = useScrollDirection(10)

  return (
    <>
      <header className={cn(
        "sticky top-0 z-30 transition-all duration-300",
        scrollDirection === 'down'
          ? "bg-background/10" 
          : "bg-background"
      )}>
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button 
            onClick={() => setSidebarOpen(true)}
            className={cn(
              "cursor-pointer hover:opacity-80 transition-all duration-300",
              scrollDirection === 'down' && "opacity-60"
            )}
          >
            <Avatar 
              src={user?.avatar} 
              name={user?.name || 'User'} 
              size="md" 
            />
          </button>
          
          <div className={cn(
            "w-8 h-8 flex items-center justify-center transition-all duration-300",
            scrollDirection === 'down' && "opacity-60"
          )}>
            <img 
              src={resolvedTheme === 'dark' ? StrakLogoWhite : StrakLogoBlack} 
              alt="Strak Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          
          <div className="w-8 h-8"></div>
        </div>
      </header>

      <MobileSidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />
    </>
  )
}
