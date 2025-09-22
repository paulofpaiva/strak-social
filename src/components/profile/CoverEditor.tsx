import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { useUpdateCover } from "@/hooks"
import { uploadCover } from "@/api/upload"
import { getFullCoverUrl } from "@/utils/formatting"
import { useToastContext } from "@/contexts/ToastContext"
import { Camera } from "lucide-react"
import { useState, useRef } from "react"

interface CoverEditorProps {
  cover?: string
}

export function CoverEditor({ cover }: CoverEditorProps) {
  const { updateCover } = useUpdateCover()
  const { success: toastSuccess, error: toastError } = useToastContext()
  const [isUpdatingCover, setIsUpdatingCover] = useState(false)
  const coverInputRef = useRef<HTMLInputElement>(null)

  const handleCoverChange = async (file: File | null) => {
    if (!file) return

    setIsUpdatingCover(true)
    
    try {
      const [uploadResult] = await Promise.all([
        uploadCover(file),
        new Promise(resolve => setTimeout(resolve, 500))
      ])
      
      await updateCover(uploadResult.url)
      
      toastSuccess('Cover updated successfully!')
    } catch (error: any) {
      toastError(error.message || 'Error updating cover')
    } finally {
      setIsUpdatingCover(false)
    }
  }

  const handleCoverClick = () => {
    if (!isUpdatingCover) {
      coverInputRef.current?.click()
    }
  }

  const handleCoverFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        toastError('Please select an image file')
        return
      }

      if (file.size > 10 * 1024 * 1024) {
        toastError('Image must be smaller than 10MB')
        return
      }

      handleCoverChange(file)
    }
  }

  return (
    <>
      <div className="relative h-48 w-full overflow-hidden">
        {cover ? (
          <img 
            src={getFullCoverUrl(cover)} 
            alt="Cover photo" 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <Camera className="h-12 w-12 text-muted-foreground/50" />
          </div>
        )}
        
        {isUpdatingCover && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Spinner size="lg" className="text-white" />
          </div>
        )}
        
        <Button
          variant="outline"
          size="sm"
          className="absolute top-4 right-4 bg-black/50 border-white/20 text-white hover:bg-black/70 cursor-pointer"
          onClick={handleCoverClick}
          disabled={isUpdatingCover}
        >
          <Camera className="h-4 w-4" />
        </Button>
      </div>

      <input
        ref={coverInputRef}
        type="file"
        accept="image/*"
        onChange={handleCoverFileChange}
        className="hidden"
      />
    </>
  )
}
