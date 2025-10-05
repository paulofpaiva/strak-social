import { useLocation, useNavigate, Outlet } from "react-router"
import { AuthLayout } from "@/layouts/AuthLayout"
import { cn } from "@/lib/utils"

type AuthTab = "signin" | "signup"

export function Auth() {
  const location = useLocation()
  const navigate = useNavigate()
  
  // Determina qual tab está ativa com base na URL
  const activeTab: AuthTab = location.pathname.includes("/auth/sign-up") 
    ? "signup" 
    : "signin"

  const handleSwitchToSignUp = () => {
    navigate("/auth/sign-up")
  }
  
  const handleSwitchToSignIn = () => {
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
    <AuthLayout 
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

        <div className="min-h-[400px]">
          <Outlet />
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
    </AuthLayout>
  )
}
