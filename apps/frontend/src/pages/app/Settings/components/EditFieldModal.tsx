import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ResponsiveModal } from '@/components/ui/responsive-modal'
import { Button } from '@/components/ui/button'
import { FloatingInput } from '@/components/ui/floating-input'
import { toast } from 'sonner'
import { checkUsernameApi } from '@/api/auth'
import { Spinner } from '@/components/ui/spinner'
import { Check, X } from 'lucide-react'
import { z } from 'zod'

interface EditFieldModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  fieldName: 'name' | 'username' | 'birthDate'
  fieldLabel: string
  fieldType: 'text' | 'date'
  currentValue: string
  schema: z.AnyZodObject
  onSave: (value: string) => Promise<void>
  showUsernameCheck?: boolean
}

export function EditFieldModal({
  open,
  onOpenChange,
  fieldName,
  fieldLabel,
  fieldType,
  currentValue,
  schema,
  onSave,
  showUsernameCheck = false
}: EditFieldModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [usernameStatus, setUsernameStatus] = useState<{
    available: boolean | null
    message: string
  }>({ available: null, message: '' })
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isValid }
  } = useForm<any>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      [fieldName]: currentValue,
    },
  })

  const watchedValue = watch(fieldName)

  useEffect(() => {
    if (open) {
      reset({
        [fieldName]: currentValue,
      })
      setUsernameStatus({ available: null, message: '' })
    }
  }, [open, currentValue, fieldName, reset])

  useEffect(() => {
    if (!showUsernameCheck || !watchedValue) return

    const checkUsernameAvailability = async () => {
      if (watchedValue === currentValue) {
        setUsernameStatus({ available: null, message: '' })
        setIsCheckingUsername(false)
        return
      }

      if (watchedValue && watchedValue.length >= 3) {
        setIsCheckingUsername(true)
        try {
          const result = await checkUsernameApi(watchedValue)
          setUsernameStatus(result)
        } catch (error: any) {
          const message = error.message.includes('Invalid username format') 
            ? 'Username can only contain letters (a-z, A-Z), numbers (0-9), underscores (_), and dots (.)'
            : error.message
          setUsernameStatus({ available: false, message })
        } finally {
          setIsCheckingUsername(false)
        }
      } else {
        setUsernameStatus({ available: null, message: '' })
        setIsCheckingUsername(false)
      }
    }

    if (watchedValue !== currentValue && watchedValue.length >= 3) {
      setIsCheckingUsername(true)
    }

    const timeoutId = setTimeout(checkUsernameAvailability, 500)
    return () => clearTimeout(timeoutId)
  }, [watchedValue, showUsernameCheck, currentValue])

  const onClose = () => {
    reset()
    setUsernameStatus({ available: null, message: '' })
    onOpenChange(false)
  }

  const onSubmit = async (data: any) => {
    try {
      setIsSubmitting(true)
      
      if (showUsernameCheck && usernameStatus.available === false) {
        toast.error('Username is not available. Please choose another one.')
        return
      }

      await onSave(data[fieldName])
      toast.success(`${fieldLabel} updated successfully!`)
      onClose()
    } catch (e: any) {
      toast.error(e?.message || `Failed to update ${fieldLabel.toLowerCase()}.`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getHintRight = () => {
    if (!showUsernameCheck) return undefined

    if (isCheckingUsername) {
      return <Spinner size="sm" className="text-muted-foreground" />
    }
    if (usernameStatus.available === true) {
      return <Check className="h-4 w-4 text-green-500" />
    }
    if (usernameStatus.available === false) {
      return <X className="h-4 w-4 text-destructive" />
    }
    return undefined
  }

  const getInputClassName = () => {
    if (!showUsernameCheck) {
      return errors[fieldName] ? 'border-destructive' : ''
    }
    
    if (usernameStatus.available === false) {
      return 'border-destructive'
    }
    if (usernameStatus.available === true) {
      return 'border-green-500'
    }
    return errors[fieldName] ? 'border-destructive' : ''
  }

  return (
    <ResponsiveModal
      isOpen={open}
      onClose={onClose}
      title={`Edit ${fieldLabel}`}
      description={`Update your ${fieldLabel.toLowerCase()}`}
      cancelText="Cancel"
      actionText="Save"
      actionButton={
        <Button
          onClick={handleSubmit(onSubmit)}
          disabled={
            isSubmitting || 
            !isValid || 
            (showUsernameCheck && (isCheckingUsername || usernameStatus.available === false))
          }
          className="flex-1"
        >
          Save
        </Button>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1">
          <FloatingInput
            id={fieldName}
            label={fieldLabel}
            type={fieldType}
            {...register(fieldName)}
            className={getInputClassName()}
            hintRight={getHintRight()}
          />
          {errors[fieldName] && (
            <p className="text-destructive text-sm">{errors[fieldName]?.message as string}</p>
          )}
          {showUsernameCheck && usernameStatus.message && (
            <p className={`text-sm ${usernameStatus.available ? 'text-green-600' : 'text-destructive'}`}>
              {usernameStatus.message}
            </p>
          )}
        </div>
      </form>
    </ResponsiveModal>
  )
}

