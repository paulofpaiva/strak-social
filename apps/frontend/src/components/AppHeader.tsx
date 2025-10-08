import { Avatar } from "@/components/ui/avatar"
import { useAuth } from "@/hooks"
import { useTheme } from "@/contexts/ThemeContext"
import { MobileSidebar } from "@/components/MobileSidebar"
import StrakLogoBlack from '/Strak_Logo_Black.png'
import StrakLogoWhite from '/Strak_Logo_White.png'
import { useState } from "react"

export function AppHeader() {
  const { user } = useAuth()
  const { resolvedTheme } = useTheme()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <>
      <header className="bg-background sticky top-0 z-30">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="cursor-pointer hover:opacity-80 transition-opacity"
          >
            <Avatar 
              src={user?.avatar} 
              name={user?.name || 'User'} 
              size="md" 
            />
          </button>
          
          <div className="w-8 h-8 flex items-center justify-center">
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
