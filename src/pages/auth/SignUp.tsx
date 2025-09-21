import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"
import { Link } from "react-router"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { signUpSchema, type SignUpFormData } from "@/schemas/auth"
import { signUpApi } from "@/api/auth"
import { useTogglePassword } from "@/hooks"
import { Eye, EyeOff } from "lucide-react"

export function SignUp() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  })

  const { showPassword, togglePassword } = useTogglePassword()

  const signUpMutation = useMutation({
    mutationFn: signUpApi,
    onSuccess: (data) => {
      console.log("User created successfully:", data)
    },
    onError: (error) => {
      console.error("Sign up failed:", error.message)
    },
  })

  const onSubmit = (data: SignUpFormData) => {
    signUpMutation.mutate(data)
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 relative">
      <div className="absolute top-6 left-6">
        <Button asChild variant="ghost" className="text-white">
          <Link to="/" className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar</span>
          </Link>
        </Button>
      </div>
      <Card className="w-full max-w-md border-gray-900 bg-black">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <span className="text-black font-bold text-lg">S</span>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-white">Create Account</CardTitle>
          <CardDescription className="text-gray-400">
            Join Strak Social and connect with the world
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                className="border-gray-600 bg-gray-800 text-white placeholder:text-gray-400 focus:border-white focus:ring-white"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-red-400 text-sm">{errors.name.message}</p>
              )}
            </div>
            
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
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="border-gray-600 bg-gray-800 text-white placeholder:text-gray-400 focus:border-white focus:ring-white pr-10"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={togglePassword}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-sm">{errors.password.message}</p>
              )}
            </div>
            
            <Button 
              type="submit" 
              disabled={isSubmitting || signUpMutation.isPending}
              className="w-full bg-white text-black hover:bg-gray-200 disabled:opacity-50"
            >
              {signUpMutation.isPending ? "Creating Account..." : "Create Account"}
            </Button>
            {signUpMutation.error && (
              <p className="text-red-400 text-sm text-center">
                {signUpMutation.error.message}
              </p>
            )}
            {signUpMutation.isSuccess && (
              <p className="text-green-400 text-sm text-center">
                Account created successfully!
              </p>
            )}
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Already have an account?{" "}
              <Button variant="link" className="p-0 h-auto text-white hover:text-gray-300">
                Sign In
              </Button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
