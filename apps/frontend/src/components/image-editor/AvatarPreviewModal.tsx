import { ResponsiveModal } from '@/components/ui/responsive-modal'
import { Button } from '@/components/ui/button'
import { Pencil, Image, Trash2, Loader2 } from 'lucide-react'
import { Avatar } from '@/components/ui/avatar'
import { useIsMobile } from '@/hooks/useIsMobile'

interface AvatarPreviewModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  avatarUrl?: string
  name: string
  onEdit: () => void
  onChange: () => void
  onDelete: () => void
  hasAvatar: boolean
  isDeleting?: boolean
}

export function AvatarPreviewModal({
  open,
  onOpenChange,
  avatarUrl,
  name,
  onEdit,
  onChange,
  onDelete,
  hasAvatar,
  isDeleting = false
}: AvatarPreviewModalProps) {
  const isMobile = useIsMobile()

  const modalContent = (
    <div className="flex flex-col items-center space-y-2 py-0">
      <div className="w-full max-w-sm aspect-square">
        <Avatar 
          src={avatarUrl}
          name={name}
          size="2xl"
          className="w-full h-full text-6xl"
        />
      </div>

      <div className="flex gap-3 pt-10 w-full">
        {hasAvatar && (
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

        {hasAvatar && (
          <Button
            variant="outline"
            onClick={() => {
              onDelete()
            }}
            disabled={isDeleting}
            className="border-0 shadow-none flex-1 flex-col h-auto py-3 gap-2"
          >
            <Trash2 className="h-5 w-5" />
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
      title="Avatar Preview"
      className="sm:max-w-lg"
    >
      {modalContent}
    </ResponsiveModal>
  )
}

