import { useState, useCallback } from 'react'
import { ResponsiveModal } from '@/components/ui/responsive-modal'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { RotateCcw, RotateCw, ZoomIn, RotateCcw as StraightenIcon, Image, FlipHorizontal, FlipVertical } from 'lucide-react'
import Cropper from 'react-easy-crop'
import { getCroppedImg, optimizeBlobSize, type Area } from '@/utils/image-processing'
import { toast } from 'sonner'
import { useIsMobile } from '@/hooks/useIsMobile'

interface CoverCropModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  imageFile: File | string | null
  onApply: (blob: Blob) => Promise<void>
  onChangePhoto: () => void
}

const ASPECT_RATIO = 16 / 9

export function CoverCropModal({
  open,
  onOpenChange,
  imageFile,
  onApply,
  onChangePhoto,
}: CoverCropModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [flipHorizontal, setFlipHorizontal] = useState(false)
  const [flipVertical, setFlipVertical] = useState(false)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const isMobile = useIsMobile()

  const imageUrl = imageFile 
    ? typeof imageFile === 'string' 
      ? imageFile 
      : URL.createObjectURL(imageFile)
    : ''

  const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const resetStates = () => {
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    setRotation(0)
    setFlipHorizontal(false)
    setFlipVertical(false)
    setCroppedAreaPixels(null)
  }

  const handleApply = async () => {
    if (!croppedAreaPixels || !imageUrl) {
      toast.error('No area selected for crop')
      return
    }

    setIsProcessing(true)

    try {
      const croppedBlob = await getCroppedImg(
        imageUrl,
        croppedAreaPixels,
        rotation,
        flipHorizontal,
        flipVertical
      )

      const optimizedBlob = await optimizeBlobSize(croppedBlob)

      await onApply(optimizedBlob)

      onOpenChange(false)
      resetStates()
    } catch (error) {
      console.error('Error processing image:', error)
      toast.error('Error processing the image. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleRotateLeft = () => {
    setRotation((prev) => Math.max(-45, prev - 1))
  }

  const handleRotateRight = () => {
    setRotation((prev) => Math.min(45, prev + 1))
  }

  const handleCancel = () => {
    onOpenChange(false)
    resetStates()
  }

  const modalContent = (
    <div className="space-y-6">
      <div className={`relative bg-gray-900 flex items-center justify-center w-full overflow-hidden rounded-lg ${
        isMobile ? 'h-48' : 'h-32 sm:h-48 md:h-64'
      }`}>
        <div 
          style={{
            transform: `scaleX(${flipHorizontal ? -1 : 1}) scaleY(${flipVertical ? -1 : 1})`,
            width: '100%',
            height: '100%'
          }}
        >
          <Cropper
            image={imageUrl}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={ASPECT_RATIO}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onRotationChange={setRotation}
            onCropComplete={onCropComplete}
          />
        </div>
      </div>

      <div className={`space-y-6 ${isMobile ? 'space-y-8' : ''}`}>
        <div className="flex items-center justify-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setFlipHorizontal(!flipHorizontal)}
            className={`${isMobile ? 'h-10 w-10' : 'h-8 w-8'}`}
          >
            <FlipHorizontal className={`${isMobile ? 'h-5 w-5' : 'h-4 w-4'}`} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setFlipVertical(!flipVertical)}
            className={`${isMobile ? 'h-10 w-10' : 'h-8 w-8'}`}
          >
            <FlipVertical className={`${isMobile ? 'h-5 w-5' : 'h-4 w-4'}`} />
          </Button>
        </div>

        <div className="space-y-2">
          <div className={`flex items-center justify-between ${isMobile ? 'text-base' : 'text-sm'}`}>
            <span className="flex items-center gap-2">
              <ZoomIn className={`${isMobile ? 'h-5 w-5' : 'h-4 w-4'}`} />
              Zoom
            </span>
            <span className="text-muted-foreground">
              {Math.round(zoom * 100)}%
            </span>
          </div>
          <Slider
            value={[zoom]}
            onValueChange={(value: number[]) => setZoom(value[0])}
            min={1}
            max={3}
            step={0.1}
            className={`w-full ${isMobile ? 'h-6' : ''}`}
          />
        </div>

        <div className="space-y-2">
          <div className={`flex items-center justify-between ${isMobile ? 'text-base' : 'text-sm'}`}>
            <span className="flex items-center gap-2">
              <StraightenIcon className={`${isMobile ? 'h-5 w-5' : 'h-4 w-4'}`} />
              Straighten
            </span>
            <span className="text-muted-foreground">
              {rotation}°
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={handleRotateLeft}
              disabled={rotation <= -45}
              className={`${isMobile ? 'h-10 w-10' : 'h-8 w-8'}`}
            >
              <RotateCcw className={`${isMobile ? 'h-5 w-5' : 'h-4 w-4'}`} />
            </Button>
            <Slider
              value={[rotation]}
              onValueChange={(value: number[]) => setRotation(value[0])}
              min={-45}
              max={45}
              step={1}
              className={`flex-1 ${isMobile ? 'h-6' : ''}`}
            />
            <Button
              variant="outline"
              size="icon"
              onClick={handleRotateRight}
              disabled={rotation >= 45}
              className={`${isMobile ? 'h-10 w-10' : 'h-8 w-8'}`}
            >
              <RotateCw className={`${isMobile ? 'h-5 w-5' : 'h-4 w-4'}`} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )

  const actionButton = (
    <div className="flex gap-3 w-full items-center">
      <Button
        variant="outline"
        onClick={onChangePhoto}
        disabled={isProcessing}
        className={isMobile ? "h-10 w-10 p-0" : "flex-1 h-10"}
      >
        {isMobile ? <Image className="h-4 w-4" /> : "Change photo"}
      </Button>
      <Button
        onClick={handleApply}
        disabled={isProcessing || !croppedAreaPixels}
        className="flex-1 h-10"
      >
        Apply
      </Button>
    </div>
  )

  return (
    <ResponsiveModal
      isOpen={open}
      onClose={handleCancel}
      title="Cover image"
      className={isMobile ? "max-h-screen" : "sm:max-w-4xl"}
      actionButton={actionButton}
      onCancel={handleCancel}
      cancelText="Cancel"
    >
      {modalContent}
    </ResponsiveModal>
  )
}

