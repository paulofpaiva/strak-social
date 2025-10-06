import { useNavigate, useSearchParams } from 'react-router-dom'

interface SearchNavigationOptions {
  basePath: string
  defaultReturnPath: string
}

export function useSearchNavigation({ basePath, defaultReturnPath }: SearchNavigationOptions) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const getCurrentSearchParams = () => {
    return searchParams.toString()
  }

  const navigateToUserProfile = (username: string) => {
    const currentParams = getCurrentSearchParams()
    
    if (currentParams) {
      navigate(`/${username}?return=${basePath}&${currentParams}`)
    } else {
      navigate(`/${username}?return=${basePath}`)
    }
  }

  const getReturnUrl = () => {
    const returnParam = searchParams.get('return')
    
    if (!returnParam) {
      return defaultReturnPath
    }

    const newSearchParams = new URLSearchParams()
    searchParams.forEach((value, key) => {
      if (key !== 'return') {
        newSearchParams.set(key, value)
      }
    })
    
    const paramsString = newSearchParams.toString()
    return `${returnParam}${paramsString ? `?${paramsString}` : ''}`
  }

  const updateSearchParams = (updates: Record<string, string | null>) => {
    const newSearchParams = new URLSearchParams(searchParams)
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '') {
        newSearchParams.delete(key)
      } else {
        newSearchParams.set(key, value)
      }
    })
    
    return newSearchParams
  }

  const navigateWithParams = (updates: Record<string, string | null>) => {
    const newSearchParams = updateSearchParams(updates)
    const newUrl = `${basePath}${newSearchParams.toString() ? `?${newSearchParams.toString()}` : ''}`
    navigate(newUrl)
  }

  return {
    getCurrentSearchParams,
    navigateToUserProfile,
    getReturnUrl,
    updateSearchParams,
    navigateWithParams,
    searchParams
  }
}
