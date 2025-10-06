import { useState, useRef } from 'react'
import { Camera, Loader2 } from 'lucide-react'
import { uploadCover } from '@/api/upload'
import { useToastContext } from '@/contexts/ToastContext'
import { useUpdateCover } from '@/hooks/useAuthStore'

interface CoverEditorProps {
  src?: string
  className?: string
}

export function CoverEditor({ src, className }: CoverEditorProps) {
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { success, error } = useToastContext()
  const { updateCover, isLoading: isUpdatingCover } = useUpdateCover()

  const handleCoverClick = () => {
    if (!isUploading && !isUpdatingCover) {
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
      const uploadResult = await uploadCover(file)
      
      await updateCover(uploadResult.url)
      success("Cover updated successfully!")
    } catch (error: any) {
      console.error('Error uploading cover:', error)
      error(error.message || "An error occurred while uploading the cover.")
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  return (
    <div className="relative group">
      <div 
        className="cursor-pointer relative"
        onClick={handleCoverClick}
      >
        {src ? (
          <img
            src={src}
            alt="Cover"
            className={`object-cover ${className}`}
          />
        ) : (
          <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
            <span className="text-gray-500 text-sm">No cover image</span>
          </div>
        )}
        
        {(isUploading || isUpdatingCover) && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-white" />
          </div>
        )}

        {!isUploading && !isUpdatingCover && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="h-6 w-6 text-white" />
          </div>
        )}
      </div>

      {/* Camera button - visible by default, hidden on hover */}
      <div className="absolute top-4 right-4 opacity-100 group-hover:opacity-0 transition-opacity">
        <button className="p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors">
          <Camera className="h-4 w-4 text-white" />
        </button>
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
