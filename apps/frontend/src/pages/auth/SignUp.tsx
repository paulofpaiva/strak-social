import { Button } from "@/components/ui/button"
import { FloatingInput } from "@/components/ui/floating-input"
import { Spinner } from "@/components/ui/spinner"
import { Link, useNavigate } from "react-router"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signUpSchema, type SignUpFormData } from "@/schemas/auth"
import { useSignUp } from "@/hooks"
import { useTogglePassword } from "@/hooks"
import { checkUsernameApi } from "@/api/auth"
import { Eye, EyeOff, Check, X } from "lucide-react"
import { useState, useEffect } from "react"

export function SignUp() {
  const navigate = useNavigate()
  const { signUp, isLoading } = useSignUp()
  const [error, setError] = useState<string>("")
  const [usernameStatus, setUsernameStatus] = useState<{
    available: boolean | null
    message: string
  }>({ available: null, message: "" })
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  })

  const { showPassword, togglePassword } = useTogglePassword()
  const watchedUsername = watch("username")

  useEffect(() => {
    const checkUsernameAvailability = async () => {
      if (watchedUsername && watchedUsername.length >= 3) {
        setIsCheckingUsername(true)
        try {
          const result = await checkUsernameApi(watchedUsername)
          setUsernameStatus(result)
        } catch (error: any) {
          const message = error.message.includes('Invalid username format') 
            ? 'Username can only contain letters (a-z, A-Z), numbers (0-9), underscores (_), and dots (.)'
            : error.message
          setUsernameStatus({ available: false, message })
        } finally {
          setIsCheckingUsername(false)
        }
      } else {
        setUsernameStatus({ available: null, message: "" })
        setIsCheckingUsername(false)
      }
    }

    const timeoutId = setTimeout(checkUsernameAvailability, 500)
    return () => clearTimeout(timeoutId)
  }, [watchedUsername])

  const onSubmit = async (data: SignUpFormData) => {
    try {
      setError("")
      
      if (usernameStatus.available === false) {
        setError("Username is not available. Please choose another one.")
        return
      }

      await signUp(data)
      navigate("/feed", { replace: true })
    } catch (error: any) {
      setError(error.message || "Error creating account")
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-1">
          <FloatingInput
            id="name"
            type="text"
            label="Name"
            {...register("name")}
          />
          {errors.name && (
            <p className="text-destructive text-sm">{errors.name.message}</p>
          )}
        </div>
        
        <div className="space-y-1">
          <FloatingInput
            id="email"
            type="email"
            label="Email"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-destructive text-sm">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <FloatingInput
            id="username"
            type="text"
            label="Username"
            {...register("username")}
            className={usernameStatus.available === false ? "border-destructive" : 
                     usernameStatus.available === true ? "border-green-500" : ""}
            hintRight={
              isCheckingUsername ? (
                <Spinner size="sm" className="text-muted-foreground" />
              ) : usernameStatus.available === true ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : usernameStatus.available === false ? (
                <X className="h-4 w-4 text-destructive" />
              ) : undefined
            }
          />
          {errors.username && (
            <p className="text-destructive text-sm">{errors.username.message}</p>
          )}
          {usernameStatus.message && (
            <p className={`text-sm ${usernameStatus.available ? "text-green-600" : "text-destructive"}`}>
              {usernameStatus.message}
            </p>
          )}
        </div>
        
        <div className="space-y-1">
          <FloatingInput
            id="password"
            type={showPassword ? "text" : "password"}
            label="Password"
            className="pr-10"
            {...register("password")}
            hintRight={
              <button
                type="button"
                onClick={togglePassword}
                className="text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
          />
          {errors.password && (
            <p className="text-destructive text-sm">{errors.password.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <FloatingInput
            id="birthDate"
            type="date"
            label="Birth Date"
            {...register("birthDate")}
          />
          {errors.birthDate && (
            <p className="text-destructive text-sm">{errors.birthDate.message}</p>
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
    </>
  )
}
