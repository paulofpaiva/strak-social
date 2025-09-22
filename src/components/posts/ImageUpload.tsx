import { useRef } from 'react'
import { Button } from '@/components/ui/button'
import { X, Image as ImageIcon, GripVertical } from 'lucide-react'
import { useFileValidation } from '@/hooks/useFileValidation'
import { useToast } from '@/hooks/useToast'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import {
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface ImageUploadProps {
  images: string[]
  onImagesChange: (images: string[]) => void
  maxImages?: number
}

interface SortableImageItemProps {
  image: string
  index: number
  onRemove: (index: number) => void
}

function SortableImageItem({ image, index, onRemove }: SortableImageItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `image-${index}` })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group"
    >
      <img
        src={image}
        alt={`Preview ${index + 1}`}
        className="w-full h-24 object-cover rounded-lg border"
      />
      
      <Button
        type="button"
        variant="destructive"
        size="sm"
        className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => onRemove(index)}
      >
        <X className="h-3 w-3" />
      </Button>

      <Button
        type="button"
        variant="secondary"
        size="sm"
        className="absolute top-1 left-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-3 w-3" />
      </Button>

      <div className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-1 rounded">
        {index + 1}
      </div>
    </div>
  )
}

export function ImageUpload({ images, onImagesChange, maxImages = 3 }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { error } = useToast()
  const { validateFile } = useFileValidation({
    maxSize: 5, // 5MB
    allowedTypes: ['image']
  })

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return

    const newImages: string[] = []
    const remainingSlots = maxImages - images.length

    for (let i = 0; i < Math.min(files.length, remainingSlots); i++) {
      const file = files[i]
      
      const validation = validateFile(file)
      if (!validation.isValid) {
        error(validation.error || "File validation error")
        continue
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        newImages.push(result)
        
        if (newImages.length === Math.min(files.length, remainingSlots)) {
          onImagesChange([...images, ...newImages])
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    onImagesChange(newImages)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = images.findIndex((_, index) => `image-${index}` === active.id)
      const newIndex = images.findIndex((_, index) => `image-${index}` === over.id)

      if (oldIndex !== -1 && newIndex !== -1) {
        onImagesChange(arrayMove(images, oldIndex, newIndex))
      }
    }
  }

  const canAddMore = images.length < maxImages

  return (
    <div className="space-y-1">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={handleClick}
        disabled={!canAddMore}
        className="h-8 w-8 p-0 text-muted-foreground hover:text-primary"
      >
        <ImageIcon className="h-4 w-4" />
      </Button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFileSelect(e.target.files)}
      />

      {images.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={images.map((_, index) => `image-${index}`)}
            strategy={verticalListSortingStrategy}
          >
            <div className="grid grid-cols-2 gap-2">
              {images.map((image, index) => (
                <SortableImageItem
                  key={`image-${index}`}
                  image={image}
                  index={index}
                  onRemove={removeImage}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  )
}