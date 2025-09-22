import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { ResponsiveModal } from "@/components/ui/responsive-modal"
import { DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FloatingInput } from "@/components/ui/floating-input"
import { FloatingTextarea } from "@/components/ui/floating-textarea"
import { useUpdateProfile } from "@/hooks"
import { useToastContext } from "@/contexts/ToastContext"
import { checkUsernameApi } from "@/api/auth"
import { useIsMobile } from "@/hooks/useIsMobile"
import { Loader2, Check, X } from "lucide-react"

const editProfileSchema = z.object({
  name: z.string().min(2, 'Name must have at least 2 characters'),
  bio: z.string().max(160, 'Bio must have at most 160 characters').optional(),
  birthDate: z.string().min(1, 'Birth date is required'),
  username: z.string()
    .min(3, 'Username must have at least 3 characters')
    .max(15, 'Username must have at most 15 characters')
    .regex(/^[a-zA-Z0-9_.]+$/, 'Username can only contain letters, numbers, underscores, and dots'),
})

type EditProfileFormData = z.infer<typeof editProfileSchema>

interface EditProfileModalProps {
  isOpen: boolean
  onClose: () => void
  currentUser: {
    name: string
    bio?: string
    birthDate?: string
    username: string
  }
}

export function EditProfileModal({ isOpen, onClose, currentUser }: EditProfileModalProps) {
  const { updateProfile, isLoading: isUpdating } = useUpdateProfile()
  const { success: toastSuccess, error: toastError } = useToastContext()
  const isMobile = useIsMobile()
  const [usernameStatus, setUsernameStatus] = useState<{
    available: boolean | null
    message: string
  }>({ available: null, message: "" })
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
    reset,
    clearErrors
  } = useForm<EditProfileFormData>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      name: currentUser.name,
      bio: currentUser.bio || "",
      birthDate: currentUser.birthDate || "",
      username: currentUser.username,
    },
    mode: "onChange"
  })
  

  const watchedUsername = watch("username")
  const watchedBio = watch("bio")

  useEffect(() => {
    reset({
      name: currentUser.name,
      bio: currentUser.bio || "",
      birthDate: currentUser.birthDate || "",
      username: currentUser.username,
    })
    setUsernameStatus({ available: null, message: "" })
  }, [currentUser, reset])

  useEffect(() => {
    if (watchedUsername && watchedUsername.length >= 3 && watchedUsername !== currentUser.username) {
      setIsCheckingUsername(true)
      setUsernameStatus({ available: null, message: "" })
    } else if (watchedUsername === currentUser.username) {
      setIsCheckingUsername(false)
      setUsernameStatus({ available: null, message: "" })
    } else {
      setIsCheckingUsername(false)
      setUsernameStatus({ available: null, message: "" })
    }

    const checkUsernameAvailability = async () => {
      if (watchedUsername && watchedUsername.length >= 3 && watchedUsername !== currentUser.username) {
        try {
          const result = await checkUsernameApi(watchedUsername)
          setUsernameStatus(result)
        } catch (error: any) {
          const message = error.message.includes('Invalid username format') 
            ? 'Username can only contain letters (a-z, A-Z), numbers (0-9), underscores (_), and dots (.)'
            : error.message
          setUsernameStatus({ available: false, message })
        } finally {
          setIsCheckingUsername(false)
        }
      }
    }

    const timeoutId = setTimeout(checkUsernameAvailability, 500)
    return () => clearTimeout(timeoutId)
  }, [watchedUsername, currentUser.username])


  const onSubmit = async (data: EditProfileFormData) => {
    try {
      if (data.username !== currentUser.username && usernameStatus.available === false) {
        toastError("Username is not available")
        return
      }

      if (data.username !== currentUser.username && usernameStatus.available !== true) {
        toastError("Please wait for username validation or choose a different username")
        return
      }

      await updateProfile({
        name: data.name,
        bio: data.bio || undefined,
        birthDate: data.birthDate,
        username: data.username,
      })

      toastSuccess("Profile updated successfully!")
      reset(data)
      onClose()
    } catch (error: any) {
      toastError(error.message || "Error updating profile")
    }
  }

  const handleClose = () => {
    reset({
      name: currentUser.name,
      bio: currentUser.bio || "",
      birthDate: currentUser.birthDate || "",
      username: currentUser.username,
    })
    setUsernameStatus({ available: null, message: "" })
    clearErrors()
    onClose()
  }

  const actionButton = isMobile ? (
    <Button type="submit" form="edit-profile-form" disabled={isUpdating || !isValid}>
      {isUpdating && <Loader2 className="h-4 w-4 animate-spin" />}
      Save
    </Button>
  ) : undefined

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Edit Profile"
      description="Make changes to your profile here."
      actionButton={actionButton}
    >
      <form id="edit-profile-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-1">
          <FloatingInput
            id="name"
            label="Name"
            {...register("name")}
            autoFocus={false}
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <FloatingInput
            id="username"
            label="Username"
            {...register("username")}
            className={usernameStatus.available === false ? "border-destructive" : 
              usernameStatus.available === true ? "border-green-500" : ""}
            hintRight={
              isCheckingUsername ? (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              ) : usernameStatus.available === true ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : usernameStatus.available === false ? (
                <X className="h-4 w-4 text-destructive" />
              ) : undefined
            }
          />
          {errors.username && (
            <p className="text-sm text-destructive">{errors.username.message}</p>
          )}
          {usernameStatus.message && !errors.username && (
            <p className={`text-sm ${usernameStatus.available === false ? 'text-destructive' : 'text-green-600'}`}>
              {usernameStatus.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <FloatingTextarea
            id="bio"
            label="Bio"
            {...register("bio")}
            rows={4}
            maxLength={160}
          />
          <div className="flex justify-between items-center">
            {errors.bio && (
              <p className="text-sm text-destructive">{errors.bio.message}</p>
            )}
            <p className={`text-sm ml-auto ${(watchedBio?.length || 0) > 140 ? 'text-destructive' : 'text-muted-foreground'}`}>
              {(watchedBio?.length || 0)}/160
            </p>
          </div>
        </div>

        <div className="space-y-1">
          <FloatingInput
            id="birthDate"
            label="Birth Date"
            type="date"
            {...register("birthDate")}
          />
          {errors.birthDate && (
            <p className="text-sm text-destructive">{errors.birthDate.message}</p>
          )}
        </div>
        
      </form>

      {!isMobile && (
        <DialogFooter className="mt-6">
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" form="edit-profile-form" disabled={isUpdating || !isValid}>
            Save
          </Button>
        </DialogFooter>
      )}
    </ResponsiveModal>
  )
}
