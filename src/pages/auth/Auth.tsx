import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router"
import { AuthLayout02 } from "@/layouts/AuthLayout02"
import { SignInForm } from "@/components/auth/SignInForm"
import { SignUpForm } from "@/components/auth/SignUpForm"
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

  const getTitle = () => {
    return activeTab === "signin" ? "Sign In" : "Create Account"
  }

  const getDescription = () => {
    return activeTab === "signin" 
      ? "Access your Strak Social account"
      : "Join Strak Social and connect with the world"
  }

  return (
    <AuthLayout02 
      title={getTitle()}
      description={getDescription()}
    >
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
            {activeTab === "signin" && (
              <SignInForm onSwitchToSignUp={handleSwitchToSignUp} />
            )}
          </div>
          <div className={cn(
            "transition-opacity duration-300",
            activeTab === "signup" ? "opacity-100" : "opacity-0 absolute"
          )}>
            {activeTab === "signup" && (
              <SignUpForm onSwitchToSignIn={handleSwitchToSignIn} />
            )}
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            {activeTab === "signin" ? (
              <>
                Don't have an account?{" "}
                <button
                  onClick={handleSwitchToSignUp}
                  className="font-medium text-primary hover:text-primary/80"
                >
                  Create account
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  onClick={handleSwitchToSignIn}
                  className="font-medium text-primary hover:text-primary/80"
                >
                  Sign In
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </AuthLayout02>
  )
}
