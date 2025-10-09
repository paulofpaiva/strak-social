import { useState, useRef } from 'react'
import { Avatar } from '@/components/ui/avatar'
import { Camera, Loader2 } from 'lucide-react'
import { uploadAvatar } from '@/api/upload'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/authStore'
import { useQueryClient } from '@tanstack/react-query'
import { AvatarCropModal } from '@/components/image-editor/AvatarCropModal'
import { AvatarPreviewModal } from '@/components/image-editor/AvatarPreviewModal'
import { deleteAvatarApi } from '@/api/profile'

interface AvatarEditorProps {
  src?: string
  name: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  className?: string
}

export function AvatarEditor({ src, name, size = 'xl', className }: AvatarEditorProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [cropModalOpen, setCropModalOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | string | null>(null)
  const [previewModalOpen, setPreviewModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { setUser } = useAuthStore()
  const queryClient = useQueryClient()

  const handleAvatarClick = () => {
    if (!isUploading && !isDeleting) {
      setPreviewModalOpen(true)
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

    setPreviewModalOpen(false)
    setSelectedFile(file)
    setCropModalOpen(true)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleApplyCrop = async (blob: Blob) => {
    if (!selectedFile) return

    setIsUploading(true)

    try {
      const fileName = typeof selectedFile === 'string' 
        ? 'avatar.jpg' 
        : selectedFile.name
      
      const processedFile = new File([blob], fileName, { 
        type: 'image/jpeg',
        lastModified: Date.now()
      })

      const result = await uploadAvatar(processedFile)
      
      if (result.user) {
        setUser(result.user)
      }
      
      await queryClient.invalidateQueries({ queryKey: ['profile'] })
      await queryClient.invalidateQueries({ queryKey: ['session'] })
      await queryClient.invalidateQueries({ queryKey: ['user-posts'] })
      await queryClient.invalidateQueries({ queryKey: ['posts'] })
      await queryClient.invalidateQueries({ queryKey: ['comments'] })
      
      toast.success("Avatar updated successfully!")
    } catch (err: any) {
      console.error('Error uploading avatar:', err)
      toast.error(err.message || "An error occurred while uploading the avatar.")
    } finally {
      setIsUploading(false)
      setSelectedFile(null)
    }
  }

  const handleChangePhoto = () => {
    fileInputRef.current?.click()
  }

  const handleEdit = () => {
    if (!src) return
    
    setSelectedFile(src)
    setCropModalOpen(true)
  }

  const handleChangeFromPreview = () => {
    fileInputRef.current?.click()
  }

  const handleDelete = async () => {
    if (!src) return

    setIsDeleting(true)

    try {
      const result = await deleteAvatarApi()
      
      if (result.user) {
        setUser(result.user)
      }
      
      await queryClient.invalidateQueries({ queryKey: ['profile'] })
      await queryClient.invalidateQueries({ queryKey: ['session'] })
      await queryClient.invalidateQueries({ queryKey: ['user-posts'] })
      await queryClient.invalidateQueries({ queryKey: ['posts'] })
      await queryClient.invalidateQueries({ queryKey: ['comments'] })
      
      setPreviewModalOpen(false)
      toast.success('Avatar deleted successfully!')
    } catch (err: any) {
      console.error('Error deleting avatar:', err)
      toast.error(err.message || 'Failed to delete avatar')
    } finally {
      setIsDeleting(false)
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
        
        {(isUploading || isDeleting) && (
          <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-white" />
          </div>
        )}

        {!isUploading && !isDeleting && (
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

      <AvatarPreviewModal
        open={previewModalOpen}
        onOpenChange={setPreviewModalOpen}
        avatarUrl={src}
        name={name}
        onEdit={handleEdit}
        onChange={handleChangeFromPreview}
        onDelete={handleDelete}
        hasAvatar={!!src}
        isDeleting={isDeleting}
      />

      <AvatarCropModal
        open={cropModalOpen}
        onOpenChange={setCropModalOpen}
        imageFile={selectedFile}
        onApply={handleApplyCrop}
        onChangePhoto={handleChangePhoto}
      />
    </div>
  )
}
