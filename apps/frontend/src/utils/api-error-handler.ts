export function handleApiError(error: any, defaultMessage: string): never {
  if (error.response?.data) {
    const apiError = error.response.data
    
    if (apiError.errors && Array.isArray(apiError.errors)) {
      const validationErrors = apiError.errors.map((err: any) => err.message).join(', ')
      throw new Error(`Validation error: ${validationErrors}`)
    }
    
    if (apiError.message) {
      throw new Error(apiError.message)
    }
    
    throw new Error(defaultMessage)
  } else if (error.request) {
    throw new Error('Connection error. Please check your internet and try again.')
  } else {
    throw new Error('An unexpected error occurred')
  }
}

