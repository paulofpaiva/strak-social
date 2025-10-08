import React, { useState } from 'react'
import { cn } from '@/lib/utils'

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
  const [imageError, setImageError] = useState(false)
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const sizeClass = sizeClasses[size]

  return (
    <div className={cn(
      'rounded-full bg-gray-600 flex items-center justify-center text-white font-medium overflow-hidden',
      sizeClass,
      className
    )}>
      {src && !imageError ? (
        <img
          key={src}
          src={src}
          alt={name}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <span className="text-white font-medium">
          {getInitials(name)}
        </span>
      )}
    </div>
  )
}
