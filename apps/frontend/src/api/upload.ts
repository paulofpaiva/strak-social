import { api } from './auth'

export interface UploadAvatarResponse {
  success: boolean
  message: string
  user: any
}

export interface UploadCoverResponse {
  success: boolean
  message: string
  user: any
}

export interface UploadMediaResponse {
  success: boolean
  message: string
  data: {
    url: string
    filename: string
    type?: 'video' | 'image'
  }
}

export interface UploadError {
  success: false
  message: string
  details?: any
}

export const uploadAvatar = async (file: File): Promise<UploadAvatarResponse> => {
  try {
    const formData = new FormData()
    formData.append('avatar', file)

    const response = await api.post<UploadAvatarResponse>('/upload/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    
    return response.data
  } catch (error: any) {
    if (error.response?.data) {
      const apiError = error.response.data
      
      if (apiError.message) {
        throw new Error(apiError.message)
      }
      
      throw new Error('Avatar upload failed. Please try again.')
    } else if (error.request) {
      throw new Error('Connection error. Please check your internet and try again.')
    } else {
      throw new Error('An unexpected error occurred')
    }
  }
}

export const uploadCover = async (file: File): Promise<UploadCoverResponse> => {
  try {
    const formData = new FormData()
    formData.append('cover', file)

    const response = await api.post<UploadCoverResponse>('/upload/cover', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    
    return response.data
  } catch (error: any) {
    if (error.response?.data) {
      const apiError = error.response.data
      
      if (apiError.message) {
        throw new Error(apiError.message)
      }
      
      throw new Error('Cover upload failed. Please try again.')
    } else if (error.request) {
      throw new Error('Connection error. Please check your internet and try again.')
    } else {
      throw new Error('An unexpected error occurred')
    }
  }
}

export const uploadMedia = async (file: File): Promise<UploadMediaResponse['data']> => {
  try {
    const formData = new FormData()
    formData.append('media', file)

    const response = await api.post<UploadMediaResponse>('/upload/media', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    
    return response.data.data
  } catch (error: any) {
    if (error.response?.data) {
      const apiError = error.response.data
      
      if (apiError.message) {
        throw new Error(apiError.message)
      }
      
      throw new Error('Media upload failed. Please try again.')
    } else if (error.request) {
      throw new Error('Connection error. Please check your internet and try again.')
    } else {
      throw new Error('An unexpected error occurred')
    }
  }
}

