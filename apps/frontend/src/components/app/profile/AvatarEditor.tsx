import { AvatarInput } from "@/components/ui/avatar-input"
import { useUpdateAvatar } from "@/hooks"
import { uploadAvatar } from "@/api/upload"
import { useToastContext } from "@/contexts/ToastContext"
import { useState } from "react"

interface AvatarEditorProps {
  avatar?: string
  name?: string
}

export function AvatarEditor({ avatar, name }: AvatarEditorProps) {
  const { updateAvatar } = useUpdateAvatar()
  const { success: toastSuccess, error: toastError } = useToastContext()
  const [isUpdatingAvatar, setIsUpdatingAvatar] = useState(false)

  const handleAvatarChange = async (file: File | null) => {
    if (!file) return

    setIsUpdatingAvatar(true)
    
    try {
      const [uploadResult] = await Promise.all([
        uploadAvatar(file),
        new Promise(resolve => setTimeout(resolve, 500))
      ])
      
      await updateAvatar(uploadResult.url)
      
      toastSuccess('Avatar updated successfully!')
    } catch (error: any) {
      toastError(error.message || 'Error updating avatar')
    } finally {
      setIsUpdatingAvatar(false)
    }
  }

  return (
    <div className="relative inline-block">
      <div className="relative">
        <AvatarInput
          value={avatar}
          onChange={handleAvatarChange}
          size="2xl"
          name={name}
          disabled={isUpdatingAvatar}
          isLoading={isUpdatingAvatar}
        />
      </div>
    </div>
  )
}
