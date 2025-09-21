import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AvatarInput } from "@/components/ui/avatar-input"
import { AuthLayout } from "@/layouts"
import { Link, useNavigate } from "react-router"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signUpSchema, type SignUpFormData } from "@/schemas/auth"
import { useSignUp } from "@/hooks"
import { useTogglePassword } from "@/hooks"
import { uploadAvatar } from "@/api/upload"
import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"

export function SignUp() {
  const navigate = useNavigate()
  const { signUp, isLoading } = useSignUp()
  const [error, setError] = useState<string>("")
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(undefined)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  })

  const { showPassword, togglePassword } = useTogglePassword()

  const onSubmit = async (data: SignUpFormData) => {
    try {
      setError("")
      
      let avatarUrl: string | undefined = undefined
      if (avatarFile) {
        const uploadResult = await uploadAvatar(avatarFile)
        avatarUrl = uploadResult.url
      }
      
      await signUp({ ...data, avatar: avatarUrl })
      navigate("/dashboard", { replace: true })
    } catch (error: any) {
      setError(error.message || "Error creating account")
    }
  }

  return (
    <AuthLayout 
      title="Create Account" 
      description="Join Strak Social and connect with the world"
    >
      <Card className="border-gray-900 bg-black">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Avatar Upload */}
            <div className="flex justify-center">
              <AvatarInput
                value={avatarPreview}
                onChange={(file, previewUrl) => {
                  setAvatarFile(file)
                  setAvatarPreview(previewUrl || undefined)
                }}
                size="xl"
              />
            </div>

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
              disabled={isLoading}
              className="w-full bg-white text-black hover:bg-gray-200 disabled:opacity-50"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
            
            {error && (
              <div className="text-red-400 text-sm text-center space-y-1">
                <p>{error}</p>
              </div>
            )}
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Already have an account?{" "}
              <Link to={"/auth/sign-in"} className="p-0 h-auto text-blue-400 hover:text-blue-300">
                Sign In
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </AuthLayout>
  )
}
