import { useState, useRef } from 'react'
import { Avatar } from '@/components/ui/avatar'
import { Camera, Loader2 } from 'lucide-react'
import { uploadAvatar } from '@/api/upload'
import { useToastContext } from '@/contexts/ToastContext'
import { useUpdateAvatar } from '@/hooks/useAuthStore'

interface AvatarEditorProps {
  src?: string
  name: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  className?: string
}

export function AvatarEditor({ src, name, size = 'xl', className }: AvatarEditorProps) {
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { success, error } = useToastContext()
  const { updateAvatar, isLoading: isUpdatingAvatar } = useUpdateAvatar()

  const handleAvatarClick = () => {
    if (!isUploading && !isUpdatingAvatar) {
      fileInputRef.current?.click()
    }
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      error("Please select only image files.")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      error("The file must be at most 5MB.")
      return
    }

    setIsUploading(true)

    try {
      const uploadResult = await uploadAvatar(file)
      
      await updateAvatar(uploadResult.url)
      success("Avatar updated successfully!")
    } catch (error: any) {
      console.error('Error uploading avatar:', error)
      error(error.message || "An error occurred while uploading the avatar.")
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
        
        {(isUploading || isUpdatingAvatar) && (
          <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-white" />
          </div>
        )}

        {!isUploading && !isUpdatingAvatar && (
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
