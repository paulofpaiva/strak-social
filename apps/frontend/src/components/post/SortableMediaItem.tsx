import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface SortableMediaItemProps {
  id: string
  file: File
  preview: string
  onRemove: () => void
}

export function SortableMediaItem({ id, file, preview, onRemove }: SortableMediaItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const isVideo = file.type.startsWith('video/')

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'relative group overflow-hidden rounded-lg border-2 transition-all touch-none',
        isDragging ? 'border-primary bg-primary/10 z-10 opacity-50' : 'border-border'
      )}
      style={{ ...style, height: '120px' }}
    >
      <div
        {...attributes}
        {...listeners}
        className="absolute inset-0 cursor-grab active:cursor-grabbing"
      >
        {isVideo ? (
          <video
            src={preview}
            className="w-full h-full object-cover pointer-events-none"
            muted
          />
        ) : (
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover pointer-events-none"
          />
        )}
      </div>
      
      <Button
        type="button"
        variant="destructive"
        size="sm"
        onClick={(e) => {
          e.stopPropagation()
          onRemove()
        }}
        className="absolute top-1 right-1 h-6 w-6 p-0 rounded-full z-20 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  )
}
