import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { Breadcrumb } from '@/components/ui/breadcrumb'

interface AuthLayoutProps {
  children: ReactNode
  title: string
  description?: string
}

export function AuthLayout({ children, title, description }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative">
      <div className="absolute top-6 left-6">
        <Breadcrumb to="/" label="Back" />
      </div>

      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-black font-bold text-sm">S</span>
            </div>
            <span className="text-xl font-bold text-white">Strak Social</span>
          </Link>
          <h1 className="text-2xl font-bold text-white">{title}</h1>
          {description && (
            <p className="text-gray-400 mt-2">{description}</p>
          )}
        </div>

        {children}
      </div>
    </div>
  )
}
