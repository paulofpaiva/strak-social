import React, { useRef, useState } from 'react'
import { Avatar } from './avatar'
import { Camera } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AvatarInputProps {
  value?: string
  onChange: (file: File | null, previewUrl?: string) => void
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  disabled?: boolean
  name?: string
}

export const AvatarInput: React.FC<AvatarInputProps> = ({
  value,
  onChange,
  size = 'xl',
  className,
  disabled = false,
  name = 'User'
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file')
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        alert('Image must be smaller than 5MB')
        return
      }

      const previewUrl = URL.createObjectURL(file)
      setPreview(previewUrl)
      onChange(file, previewUrl)
    } else {
      // Se não há arquivo selecionado, não faz nada
      // Mantém o estado atual
    }
  }


  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click()
    }
  }

  const currentAvatar = preview || value

  return (
    <div className={cn('flex flex-col items-center space-y-4', className)}>
      <div className="relative group">
        <Avatar
          src={currentAvatar || undefined}
          name={name}
          size={size}
          className="cursor-pointer transition-opacity group-hover:opacity-80"
        />
        
        {!disabled && (
          <div className="absolute inset-0 rounded-full bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
               onClick={handleClick}>
            <Camera className="h-6 w-6 text-white" />
          </div>
        )}

      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />


    </div>
  )
}
