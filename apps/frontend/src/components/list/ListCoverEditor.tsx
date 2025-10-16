import { useState, useRef } from 'react'
import { Camera } from 'lucide-react'
import { toast } from 'sonner'
import { CoverCropModal } from '@/components/image-editor/CoverCropModal'
import { CoverPreviewModal } from '@/components/image-editor/CoverPreviewModal'

interface ListCoverEditorProps {
  src?: string | null
  className?: string
  onCoverChange?: (file: File | null) => void
}

export function ListCoverEditor({ src, className, onCoverChange }: ListCoverEditorProps) {
  const [cropModalOpen, setCropModalOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(src || null)
  const [previewModalOpen, setPreviewModalOpen] = useState(false)
  const [localFile, setLocalFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

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

    try {
      const fileName = typeof selectedFile === 'string' 
        ? 'cover.jpg' 
        : selectedFile.name
      
      const processedFile = new File([blob], fileName, { 
        type: 'image/jpeg',
        lastModified: Date.now()
      })

      const localUrl = URL.createObjectURL(processedFile)
      setPreviewUrl(localUrl)
      setLocalFile(processedFile)
      
      onCoverChange?.(processedFile)
      
      setCropModalOpen(false)
      setSelectedFile(null)
    } catch (err: any) {
      console.error('Error processing image:', err)
      toast.error(err.message || "An error occurred while processing the image.")
    }
  }

  const handleChangePhoto = () => {
    fileInputRef.current?.click()
  }

  const handleEdit = () => {
    if (!previewUrl) return
    
    if (localFile) {
      setSelectedFile(localFile)
    } else {
      setSelectedFile(previewUrl)
    }
    setCropModalOpen(true)
    setPreviewModalOpen(false)
  }

  const handleChangeFromPreview = () => {
    setPreviewModalOpen(false)
    fileInputRef.current?.click()
  }

  const handleDelete = () => {
    setPreviewUrl(null)
    setLocalFile(null)
    onCoverChange?.(null)
    setPreviewModalOpen(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleCoverClick = () => {
    if (previewUrl) {
      setPreviewModalOpen(true)
    }
  }

  return (
    <>
      <div className={className}>
        <button 
          type="button"
          className="relative w-full h-48 bg-muted rounded-lg overflow-hidden group cursor-pointer block"
          onClick={previewUrl ? handleCoverClick : handleChangePhoto}
        >
          {previewUrl ? (
            <>
              <img
                src={previewUrl}
                alt="List cover"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-all flex items-center justify-center">
                <Camera className="h-8 w-8 text-white" />
              </div>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center hover:bg-accent/50 transition-colors">
              <div className="text-center">
                <Camera className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Add cover photo</span>
              </div>
            </div>
          )}
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {cropModalOpen && selectedFile && (
        <CoverCropModal
          open={cropModalOpen}
          onOpenChange={setCropModalOpen}
          imageFile={selectedFile}
          onApply={handleApplyCrop}
          onChangePhoto={handleChangeFromPreview}
        />
      )}

      {previewModalOpen && previewUrl && (
        <CoverPreviewModal
          open={previewModalOpen}
          onOpenChange={setPreviewModalOpen}
          coverUrl={previewUrl}
          onEdit={handleEdit}
          onChange={handleChangeFromPreview}
          onDelete={handleDelete}
          hasCover={!!previewUrl}
        />
      )}
    </>
  )
}
