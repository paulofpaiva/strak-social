import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AuthLayout } from "@/layouts"
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
      await login(data.email, data.password)
      
      const from = location.state?.from?.pathname || "/dashboard"
      navigate(from, { replace: true })
    } catch (error: any) {
      setError(error.message || "Login error")
    }
  }

  return (
    <AuthLayout 
      title="Sign In" 
      description="Access your Strak Social account"
    >
      <Card className="border-gray-900 bg-black">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="border-gray-600 bg-gray-800 text-white placeholder:text-gray-400 focus:border-white focus:ring-white"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-red-400 text-sm">{errors.email.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                className="border-gray-600 bg-gray-800 text-white placeholder:text-gray-400 focus:border-white focus:ring-white"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-red-400 text-sm">{errors.password.message}</p>
              )}
            </div>
            
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-white text-black hover:bg-gray-200 disabled:opacity-50"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
            
            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Don't have an account?{" "}
              <Link to={"/auth/sign-up"} className="p-0 h-auto text-blue-400 hover:text-blue-300">
              Create account
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </AuthLayout>
  )
}
