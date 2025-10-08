import type { ReactNode } from 'react'
import { useNavigate } from 'react-router'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import StrakLogoBlack from '/Strak_Logo_Black.png'
import StrakLogoWhite from '/Strak_Logo_White.png'
import { useTheme } from '@/contexts/ThemeContext'

interface AuthLayoutProps {
  children: ReactNode
  title: string
  description?: string
}

export function AuthLayout({ children, title, description }: AuthLayoutProps) {
  const navigate = useNavigate()
  const { resolvedTheme } = useTheme()

  const handleBackToLanding = () => {
    navigate("/")
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <div className="absolute top-4 left-4 z-10">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBackToLanding}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>
      </div>
      <div className="hidden lg:flex lg:flex-col lg:justify-center lg:px-8 xl:px-12 bg-muted/50">
        <div className="max-w-md mx-auto">
          <div className="flex items-center mb-8">
            <img 
              src={resolvedTheme === 'dark' ? StrakLogoWhite : StrakLogoBlack} 
              alt="Strak Social" 
              className="h-10 w-auto object-contain"
            />
          </div>
          
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold mb-4">Welcome to Strak Social</h2>
              <p className="text-muted-foreground text-lg">
                Connect with the world through authentic experiences and real connections. 
                Join thousands of users who have already discovered a new way to socialize.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-primary text-sm">🔗</span>
                </div>
                <div>
                  <h3 className="font-medium">Real Connections</h3>
                  <p className="text-sm text-muted-foreground">Connect with people who share your interests</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-primary text-sm">🎯</span>
                </div>
                <div>
                  <h3 className="font-medium">Authentic Content</h3>
                  <p className="text-sm text-muted-foreground">Share real moments without filters</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-primary text-sm">⚡</span>
                </div>
                <div>
                  <h3 className="font-medium">Intuitive Interface</h3>
                  <p className="text-sm text-muted-foreground">Clean and functional design</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4 lg:hidden">
              <img 
                src={resolvedTheme === 'dark' ? StrakLogoWhite : StrakLogoBlack} 
                alt="Strak Social" 
                className="h-10 w-auto object-contain"
              />
            </div>
            <h2 className="text-2xl font-bold">{title}</h2>
            {description && (
              <p className="text-muted-foreground mt-2">{description}</p>
            )}
          </div>

          {children}
        </div>
      </div>
    </div>
  )
}
