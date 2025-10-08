import { useState, useRef } from 'react'
import { Avatar } from '@/components/ui/avatar'
import { Camera, Loader2 } from 'lucide-react'
import { uploadAvatar } from '@/api/upload'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/authStore'
import { useQueryClient } from '@tanstack/react-query'

interface AvatarEditorProps {
  src?: string
  name: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  className?: string
}

export function AvatarEditor({ src, name, size = 'xl', className }: AvatarEditorProps) {
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { setUser } = useAuthStore()
  const queryClient = useQueryClient()

  const handleAvatarClick = () => {
    if (!isUploading) {
      fileInputRef.current?.click()
    }
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error("Please select only image files.")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("The file must be at most 5MB.")
      return
    }

    setIsUploading(true)

    try {
      const result = await uploadAvatar(file)
      
      if (result.user) {
        setUser(result.user)
      }
      
      await queryClient.invalidateQueries({ queryKey: ['profile'] })
      await queryClient.invalidateQueries({ queryKey: ['session'] })
      
      toast.success("Avatar updated successfully!")
    } catch (err: any) {
      console.error('Error uploading avatar:', err)
      toast.error(err.message || "An error occurred while uploading the avatar.")
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  return (
    <div className="relative">
      <div 
        className="cursor-pointer relative group"
        onClick={handleAvatarClick}
      >
        <Avatar 
          src={src} 
          name={name} 
          size={size}
          className={className}
        />
        
        {isUploading && (
          <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-white" />
          </div>
        )}

        {!isUploading && (
          <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
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
      />
    </div>
  )
}
