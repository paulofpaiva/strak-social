import { useEffect, useState, useRef } from 'react'
import { Camera, Loader2 } from 'lucide-react'
import { uploadCover } from '@/api/upload'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/authStore'
import { Button } from '@/components/ui/button'
import { useQueryClient } from '@tanstack/react-query'

interface CoverEditorProps {
  src?: string
  className?: string
}

export function CoverEditor({ src, className }: CoverEditorProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [isFakeLoading, setIsFakeLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { setUser } = useAuthStore()
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!src) {
      setIsFakeLoading(false)
      return
    }
    setIsFakeLoading(true)
    const id = setTimeout(() => setIsFakeLoading(false), 0)
    return () => clearTimeout(id)
  }, [src])

  const handleCoverClick = () => {
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
      const result = await uploadCover(file)
      
      if (result.user) {
        setUser(result.user)
      }
      
      await queryClient.invalidateQueries({ queryKey: ['profile'] })
      await queryClient.invalidateQueries({ queryKey: ['session'] })
      
      toast.success("Cover updated successfully!")
    } catch (err: any) {
      console.error('Error uploading cover:', err)
      toast.error(err.message || "An error occurred while uploading the cover.")
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
          isFakeLoading ? (
            <div className={`bg-gradient-to-r from-gray-700 to-gray-600 flex items-center animate-pulse justify-center ${className}`}></div>
          ) : (
            <img
              src={src}
              alt="Cover"
              className={`object-cover ${className}`}
              loading="eager"
              decoding="async"
            />
          )
        ) : (
          <div className={`bg-gradient-to-r from-gray-700 to-gray-600 flex items-center justify-center ${className}`}>
          </div>
        )}
        
        {isUploading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-white" />
          </div>
        )}

        {!isUploading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="h-6 w-6 text-white" />
          </div>
        )}
      </div>

      <div className="absolute top-4 right-4 opacity-100 group-hover:opacity-0 transition-opacity">
        <Button 
          variant="secondary"
          size="icon"
          className="bg-black/50 hover:bg-black/70 rounded-full"
        >
          <Camera className="h-4 w-4 text-white" />
        </Button>
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
