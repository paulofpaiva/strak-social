import { useCallback } from 'react'

interface FileValidationOptions {
  maxSize: number
  allowedTypes: string[]
}

interface ValidationResult {
  isValid: boolean
  error?: string
}

export function useFileValidation({ maxSize, allowedTypes }: FileValidationOptions) {
  const validateFile = useCallback((file: File): ValidationResult => {
    const fileType = file.type.toLowerCase()
    const isValidType = allowedTypes.some(type => fileType.includes(type))
    
    if (!isValidType) {
      return {
        isValid: false,
        error: `File type not supported. Allowed types: ${allowedTypes.join(', ')}`
      }
    }

    const fileSizeMB = file.size / (1024 * 1024)
    if (fileSizeMB > maxSize) {
      return {
        isValid: false,
        error: `File too large. Maximum size: ${maxSize}MB`
      }
    }

    return { isValid: true }
  }, [maxSize, allowedTypes])

  const getMediaType = useCallback((file: File): 'image' | 'gif' | 'video' => {
    const fileType = file.type.toLowerCase()
    
    if (fileType.includes('gif')) return 'gif'
    if (fileType.includes('video')) return 'video'
    return 'image'
  }, [])

  return {
    validateFile,
    getMediaType
  }
}
