import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AvatarInput } from "@/components/ui/avatar-input"
import { AuthLayout02 } from "@/layouts/AuthLayout02"
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
    <AuthLayout02 
      title="Create Account" 
      description="Join Strak Social and connect with the world"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="Enter your name"
            {...register("name")}
          />
          {errors.name && (
            <p className="text-destructive text-sm">{errors.name.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-destructive text-sm">{errors.email.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="pr-10"
              {...register("password")}
            />
            <button
              type="button"
              onClick={togglePassword}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-destructive text-sm">{errors.password.message}</p>
          )}
        </div>
        
        <Button 
          type="submit" 
          disabled={isLoading}
          className="w-full disabled:opacity-50"
        >
          {isLoading ? "Creating Account..." : "Create Account"}
        </Button>
        
        {error && (
          <div className="text-destructive text-sm text-center space-y-1">
            <p>{error}</p>
          </div>
        )}
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to={"/auth/sign-in"} className="font-medium text-primary hover:text-primary/80">
            Sign In
          </Link>
        </p>
      </div>
    </AuthLayout02>
  )
}
