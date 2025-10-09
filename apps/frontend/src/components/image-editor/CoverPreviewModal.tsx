import { ResponsiveModal } from '@/components/ui/responsive-modal'
import { Button } from '@/components/ui/button'
import { Pencil, Image, Trash2, Loader2 } from 'lucide-react'
import { useIsMobile } from '@/hooks/useIsMobile'

interface CoverPreviewModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  coverUrl?: string
  onEdit: () => void
  onChange: () => void
  onDelete: () => void
  hasCover: boolean
  isDeleting?: boolean
}

export function CoverPreviewModal({
  open,
  onOpenChange,
  coverUrl,
  onEdit,
  onChange,
  onDelete,
  hasCover,
  isDeleting = false
}: CoverPreviewModalProps) {
  const isMobile = useIsMobile()

  const modalContent = (
    <div className="flex flex-col items-center space-y-2 py-0">
      <div className="w-full aspect-video">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt="Cover preview"
            className="w-full h-full object-cover rounded-lg"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-gray-700 to-gray-600 rounded-lg" />
        )}
      </div>

      <div className="flex gap-3 pt-10 w-full">
        {hasCover && (
          <Button
            variant="outline"
            onClick={() => {
              onEdit()
              onOpenChange(false)
            }}
            disabled={isDeleting}
            className="border-0 shadow-none flex-1 flex-col h-auto py-3 gap-2"
          >
            <Pencil className="h-5 w-5" />
            <span className="text-xs">Edit</span>
          </Button>
        )}
        
        <Button
          variant="outline"
          onClick={() => {
            onChange()
          }}
          disabled={isDeleting}
          className="border-0 shadow-none flex-1 flex-col h-auto py-3 gap-2"
        >
          <Image className="h-5 w-5" />
          <span className="text-xs">{isMobile ? "Change" : "Change photo"}</span>
        </Button>

        {hasCover && (
          <Button
            variant="outline"
            onClick={() => {
              onDelete()
            }}
            disabled={isDeleting}
            className="border-0 shadow-none flex-1 flex-col h-auto py-3 gap-2"
          >
            {isDeleting ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Trash2 className="h-5 w-5" />
            )}
            <span className="text-xs">Delete</span>
          </Button>
        )}
      </div>
    </div>
  )

  return (
    <ResponsiveModal
      isOpen={open}
      onClose={() => onOpenChange(false)}
      title="Cover Preview"
      className="sm:max-w-2xl"
    >
      {modalContent}
    </ResponsiveModal>
  )
}

