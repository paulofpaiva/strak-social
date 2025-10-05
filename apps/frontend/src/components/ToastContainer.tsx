import { Toast } from '@/components/ui/toast'
import { useToastContext } from '@/contexts/ToastContext'

export function ToastContainer() {
  const { toasts, removeToast } = useToastContext()

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          type={toast.type}
          message={toast.message}
          onRemove={removeToast}
        />
      ))}
    </div>
  )
}
