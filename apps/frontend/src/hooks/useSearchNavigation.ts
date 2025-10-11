import { useNavigate, useSearchParams } from 'react-router-dom'

interface SearchNavigationOptions {
  basePath: string
  defaultReturnPath?: string
}

/**
 * Hook simplificado para gerenciar search params e navegação
 * Para navegação com return/back, use useNavigationState
 */
export function useSearchNavigation({ basePath }: SearchNavigationOptions) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const getCurrentSearchParams = () => {
    return searchParams.toString()
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
    updateSearchParams,
    navigateWithParams,
    searchParams
  }
}
