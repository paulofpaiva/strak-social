import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Menu } from "lucide-react"
import { useIsMobile } from "@/hooks"
import { Link } from "react-router";

export function Header() {
  const isMobile = useIsMobile()
  return (
    <header className="border-b border-gray-800">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <span className="text-black font-bold text-sm">S</span>
          </div>
          <h1 className="text-2xl font-bold">Strak Social</h1>
        </div>
        
        {/* Desktop Menu */}
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
              <Button variant="ghost" size="icon" className="text-white hover:bg-gray-800">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-black border-gray-800 text-white max-w-[400px] w-[90vw]">
              <DialogHeader>
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <span className="text-black font-bold text-sm">S</span>
                  </div>
                  <DialogTitle className="text-xl font-bold text-white">Strak Social</DialogTitle>
                </div>
              </DialogHeader>
              
              <div className="space-y-6">
                <div className="space-y-3">
                  <Button asChild variant="ghost" className="w-full justify-start h-12 text-base font-medium text-white hover:bg-gray-800">
                    <Link to="/auth/sign-in">
                      Sign In
                    </Link>
                  </Button>
                  <Button asChild className="w-full justify-start h-12 text-base font-medium bg-white text-black hover:bg-gray-200">
                    <Link to="/auth/sign-up">
                      Sign Up
                    </Link>
                  </Button>
                </div>
              </div>
              
              <div className="pt-6 border-t border-gray-800">
                <p className="text-xs text-gray-400 text-center">
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
