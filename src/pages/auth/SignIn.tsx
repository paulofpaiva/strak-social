import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"
import { Link, useNavigate, useLocation } from "react-router"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signInSchema, type SignInFormData } from "@/schemas/auth"
import { useLogin } from "@/hooks/useAuth"
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
      
      // Redirecionar para a página que tentou acessar ou dashboard
      const from = location.state?.from?.pathname || "/app/dashboard"
      navigate(from, { replace: true })
    } catch (error: any) {
      setError(error.message || "Erro ao fazer login")
    }
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
          <CardTitle className="text-2xl font-bold text-white">Entrar</CardTitle>
          <CardDescription className="text-gray-400">
            Acesse sua conta no Strak Social
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Digite seu email"
                className="border-gray-600 bg-gray-800 text-white placeholder:text-gray-400 focus:border-white focus:ring-white"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-red-400 text-sm">{errors.email.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Digite sua senha"
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
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
            
            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Não tem uma conta?{" "}
              <Button asChild variant="link" className="p-0 h-auto text-white hover:text-gray-300">
                <Link to="/auth/sign-up">Criar conta</Link>
              </Button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
