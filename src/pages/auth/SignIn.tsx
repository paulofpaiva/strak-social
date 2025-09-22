import { Button } from "@/components/ui/button"
import { FloatingInput } from "@/components/ui/floating-input"
import { Link, useNavigate, useLocation } from "react-router"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signInSchema, type SignInFormData } from "@/schemas/auth"
import { useLogin } from "@/hooks"
import { useState } from "react"

export function SignIn() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, isLoading } = useLogin()
  const [error, setError] = useState<string>("")

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  })

  const onSubmit = async (data: SignInFormData) => {
    try {
      setError("")
      await login(data.emailOrUsername, data.password)
      
      const from = location.state?.from?.pathname || "/feed"
      navigate(from, { replace: true })
    } catch (error: any) {
      setError(error.message || "Login error")
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1">
          <FloatingInput
            id="emailOrUsername"
            type="text"
            label="Email or Username"
            {...register("emailOrUsername")}
          />
          {errors.emailOrUsername && (
            <p className="text-destructive text-sm">{errors.emailOrUsername.message}</p>
          )}
        </div>
        
        <div className="space-y-1">
          <FloatingInput
            id="password"
            type="password"
            label="Password"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-destructive text-sm">{errors.password.message}</p>
          )}
        </div>
        
        <Button 
          type="submit" 
          disabled={isLoading}
          className="w-full disabled:opacity-50"
        >
          {isLoading ? "Signing in..." : "Sign in"}
        </Button>
        
        {error && (
          <p className="text-destructive text-sm text-center">{error}</p>
        )}
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link to={"/auth/sign-up"} className="font-medium text-primary hover:text-primary/80">
            Create account
          </Link>
        </p>
      </div>
    </>
  )
}
