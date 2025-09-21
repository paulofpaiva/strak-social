import { X, CheckCircle, XCircle, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ToastProps {
  id: string
  type: 'success' | 'error' | 'info'
  message: string
  onRemove: (id: string) => void
}

export function Toast({ id, type, message, onRemove }: ToastProps) {
  const icons = {
    success: CheckCircle,
    error: XCircle,
    info: Info,
  }

  const colors = {
    success: 'bg-white border-gray-300 text-black',
    error: 'bg-black border-gray-600 text-white',
    info: 'bg-white border-gray-300 text-black',
  }

  const Icon = icons[type]

  return (
    <div
      className={cn(
        'flex items-center gap-3 p-4 rounded-lg border shadow-lg min-w-80 max-w-md',
        colors[type],
        'animate-in slide-in-from-right-full duration-300'
      )}
    >
      <Icon className="h-5 w-5 flex-shrink-0" />
      <span className="flex-1 text-sm font-medium">{message}</span>
      <button
        onClick={() => onRemove(id)}
        className="flex-shrink-0 p-1 rounded hover:bg-gray-200 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
