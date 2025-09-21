import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AvatarInput } from "@/components/ui/avatar-input"
import { useUpdateProfile } from "@/hooks"
import { uploadAvatar } from "@/api/upload"
import { useAuth } from "@/hooks"
import { useToastContext } from "@/contexts/ToastContext"
import { User, Mail, Calendar } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be less than 50 characters'),
})

type ProfileFormData = z.infer<typeof profileSchema>

export function ProfileSettings() {
  const { user } = useAuth()
  const { updateProfile, isLoading } = useUpdateProfile()
  const { success: toastSuccess, error: toastError } = useToastContext()
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(user?.avatar)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
    },
  })

  const onSubmit = async (data: ProfileFormData) => {
    try {
      let avatarUrl: string | undefined = undefined
      if (avatarFile) {
        const uploadResult = await uploadAvatar(avatarFile)
        avatarUrl = uploadResult.url
      }
      
      await updateProfile({ 
        name: data.name, 
        avatar: avatarUrl || user?.avatar
      })
      
      toastSuccess('Profile updated successfully!')
      setAvatarFile(null)
    } catch (error: any) {
      toastError(error.message || 'Error updating profile')
    }
  }

  const handleAvatarChange = (file: File | null, previewUrl?: string) => {
    setAvatarFile(file)
    if (file && previewUrl) {
      setAvatarPreview(previewUrl)
    } else if (!file) {
      setAvatarPreview(user?.avatar)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <Card className="border-gray-800 bg-gray-900">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <User className="h-5 w-5 mr-2" />
          Profile
        </CardTitle>
        <CardDescription className="text-gray-400">
          Manage your account settings and set e-mail preferences.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Avatar Upload */}
        <div className="flex flex-col items-center space-y-0">
          <AvatarInput
            value={avatarPreview}
            onChange={handleAvatarChange}
            size="xl"
            name={user.name}
          />
          <p className="text-sm text-gray-400 text-center">
            Click the photo to change your avatar
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Username Field */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white">
              Username
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your username"
              className="border-gray-600 bg-gray-800 text-white placeholder:text-gray-400 focus:border-white focus:ring-white"
              {...register('name')}
            />
            <p className="text-xs text-gray-400">
              This is your public display name. It can be your real name or a pseudonym. You can only change this once every 30 days.
            </p>
            {errors.name && (
              <p className="text-red-400 text-sm">{errors.name.message}</p>
            )}
          </div>

          {/* Email Field (Read-only) */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">
              Email
            </Label>
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                value={user.email}
                disabled
                className="border-gray-600 bg-gray-700 text-gray-300 cursor-not-allowed"
              />
            </div>
            <p className="text-xs text-gray-400">
              You can manage verified email addresses in your email settings.
            </p>
          </div>

          {/* Member Since */}
          <div className="space-y-2">
            <Label className="text-white">Member since</Label>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span className="text-gray-300">
                {new Date(user.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
          </div>


          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-white text-black hover:bg-gray-200 disabled:opacity-50"
            >
              {isLoading ? 'Updating...' : 'Update profile'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
