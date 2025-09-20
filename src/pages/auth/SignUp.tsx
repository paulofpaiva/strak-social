import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"
import { Link } from "react-router"

export function SignUp() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 relative">
      {/* Botão de Voltar */}
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
          <CardTitle className="text-2xl font-bold text-white">Criar Conta</CardTitle>
          <CardDescription className="text-gray-400">
            Junte-se ao Strak Social e conecte-se com o mundo
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-white">Nome de usuário</Label>
              <Input
                id="username"
                type="text"
                placeholder="Digite seu nome de usuário"
                className="border-gray-600 bg-gray-800 text-white placeholder:text-gray-400 focus:border-white focus:ring-white"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Digite seu email"
                className="border-gray-600 bg-gray-800 text-white placeholder:text-gray-400 focus:border-white focus:ring-white"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Digite sua senha"
                className="border-gray-600 bg-gray-800 text-white placeholder:text-gray-400 focus:border-white focus:ring-white"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-white text-black hover:bg-gray-200"
            >
              Criar Conta
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Já tem uma conta?{" "}
              <Button variant="link" className="p-0 h-auto text-white hover:text-gray-300">
                Entrar
              </Button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
