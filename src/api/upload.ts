const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export interface UploadResponse {
  message: string
  url: string
  filename: string
}

export const uploadAvatar = async (file: File): Promise<UploadResponse> => {
  try {
    const formData = new FormData()
    formData.append('avatar', file)

    const response = await fetch(`${API_BASE_URL}/api/avatar`, {
      method: 'POST',
      body: formData,
      credentials: 'include'
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Upload failed')
    }

    const data = await response.json()
    return data
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('An unexpected error occurred during upload')
  }
}

export const getAvatarUrl = (filename: string): string => {
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'
  return `${API_BASE_URL}/api/uploads/avatars/${filename}`
}
