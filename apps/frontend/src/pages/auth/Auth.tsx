import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router"
import { SignIn } from "./SignIn"
import { SignUp } from "./SignUp"
import { cn } from "@/lib/utils"

type AuthTab = "signin" | "signup"

export function Auth() {
  const location = useLocation()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<AuthTab>("signin")

  useEffect(() => {
    if (location.pathname === "/auth/sign-up") {
      setActiveTab("signup")
    } else {
      setActiveTab("signin")
    }
  }, [location.pathname])

  const handleSwitchToSignUp = () => {
    setActiveTab("signup")
    navigate("/auth/sign-up")
  }
  
  const handleSwitchToSignIn = () => {
    setActiveTab("signin")
    navigate("/auth/sign-in")
  }

  return (
    <div className="space-y-6">
        <div className="flex space-x-1 bg-muted p-1 rounded-lg">
          <button
            onClick={handleSwitchToSignIn}
            className={cn(
              "flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all duration-200 focus:outline-none",
              activeTab === "signin" 
                ? "bg-background text-foreground shadow-sm" 
                : "text-muted-foreground hover:text-foreground hover:bg-background/50"
            )}
          >
            Sign In
          </button>
          <button
            onClick={handleSwitchToSignUp}
            className={cn(
              "flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all duration-200 focus:outline-none",
              activeTab === "signup" 
                ? "bg-background text-foreground shadow-sm" 
                : "text-muted-foreground hover:text-foreground hover:bg-background/50"
            )}
          >
            Sign Up
          </button>
        </div>

        <div className="min-h-[400px] transition-all duration-300 ease-in-out">
          <div className={cn(
            "transition-opacity duration-300",
            activeTab === "signin" ? "opacity-100" : "opacity-0 absolute"
          )}>
            {activeTab === "signin" && <SignIn />}
          </div>
          <div className={cn(
            "transition-opacity duration-300",
            activeTab === "signup" ? "opacity-100" : "opacity-0 absolute"
          )}>
            {activeTab === "signup" && <SignUp />}
          </div>
        </div>

    </div>
  )
}
