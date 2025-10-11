import { useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/stores/authStore'
import { updateNameApi, updateUsernameApi, updateBirthDateApi } from '@/api/profile'

export function useAccountFieldUpdates() {
  const queryClient = useQueryClient()
  const { user: authUser, setUser } = useAuthStore()

  const updateUserCaches = (updatedFields: Record<string, any>, oldUsername?: string) => {
    if (!authUser) return

    const updatedUser = { ...authUser, ...updatedFields }
    setUser(updatedUser)

    queryClient.setQueryData(['session'], (oldData: any) => {
      if (oldData?.user) {
        return { ...oldData, user: updatedUser }
      }
      return oldData
    })

    queryClient.setQueryData(['profile'], (oldData: any) => {
      if (oldData?.user) {
        return { ...oldData, user: { ...oldData.user, ...updatedFields } }
      }
      return oldData
    })

    const usernameKey = oldUsername || authUser.username
    if (oldUsername && updatedFields.username) {
      queryClient.removeQueries({ queryKey: ['user-profile', oldUsername] })
    }
    
    queryClient.setQueryData(['user-profile', usernameKey], (oldData: any) => {
      if (oldData) {
        return { ...oldData, ...updatedFields }
      }
      return oldData
    })

    setTimeout(() => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      queryClient.invalidateQueries({ queryKey: ['user-posts'] })
      queryClient.invalidateQueries({ queryKey: ['comments'] })
    }, 100)
  }

  const updateName = async (name: string) => {
    const response = await updateNameApi(name)
    if (authUser && response?.user) {
      updateUserCaches({
        name: response.user.name,
        updatedAt: response.user.updatedAt
      })
    }
  }

  const updateUsername = async (username: string) => {
    const response = await updateUsernameApi(username)
    if (authUser && response?.user) {
      const oldUsername = authUser.username
      updateUserCaches(
        {
          username: response.user.username,
          updatedAt: response.user.updatedAt
        },
        oldUsername
      )
    }
  }

  const updateBirthDate = async (birthDate: string) => {
    const response = await updateBirthDateApi(birthDate)
    if (authUser && response?.user) {
      updateUserCaches({
        birthDate: response.user.birthDate,
        updatedAt: response.user.updatedAt
      })
    }
  }

  return {
    updateName,
    updateUsername,
    updateBirthDate
  }
}

