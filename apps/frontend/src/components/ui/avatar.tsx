import React from 'react'
import { cn } from '@/lib/utils'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

const getAvatarUrl = (src?: string): string | undefined => {
  if (!src) return undefined
  
  // Se é uma blob URL ou URL completa, retorna como está
  if (src.startsWith('http') || src.startsWith('blob:')) return src
  
  if (src.startsWith('/uploads/')) {
    return `${API_BASE_URL}/api${src}`
  }
  
  return `${API_BASE_URL}/api/uploads/avatars/${src}`
}

interface AvatarProps {
  src?: string
  name: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  className?: string
}

const sizeClasses = {
  sm: 'w-6 h-6 text-xs',
  md: 'w-8 h-8 text-sm',
  lg: 'w-12 h-12 text-lg',
  xl: 'w-16 h-16 text-xl',
  '2xl': 'w-24 h-24 text-2xl'
}

export const Avatar: React.FC<AvatarProps> = ({ 
  src, 
  name, 
  size = 'md', 
  className 
}) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const sizeClass = sizeClasses[size]

  const avatarUrl = getAvatarUrl(src)

  return (
    <div className={cn(
      'rounded-full bg-gray-600 flex items-center justify-center text-white font-medium overflow-hidden',
      sizeClass,
      className
    )}>
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={name}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.style.display = 'none'
            const parent = target.parentElement
            if (parent) {
              parent.innerHTML = `<span class="text-white font-medium">${getInitials(name)}</span>`
            }
          }}
        />
      ) : (
        <span className="text-white font-medium">
          {getInitials(name)}
        </span>
      )}
    </div>
  )
}
