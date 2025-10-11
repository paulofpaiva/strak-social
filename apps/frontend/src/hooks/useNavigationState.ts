import { useNavigate, useLocation, NavigateOptions } from 'react-router-dom'

interface NavigationState {
  from?: string
  searchParams?: string
}

interface UseNavigationStateReturn {
  navigateWithReturn: (to: string, options?: NavigateOptions) => void
  navigateBack: (fallbackPath?: string) => void
  getReturnUrl: () => string
}

export function useNavigationState(defaultFallback: string = '/feed'): UseNavigationStateReturn {
  const navigate = useNavigate()
  const location = useLocation()

  const navigateWithReturn = (to: string, options?: NavigateOptions) => {
    const currentPath = location.pathname
    const currentSearch = location.search

    const state: NavigationState = {
      from: currentPath,
      searchParams: currentSearch
    }

    navigate(to, {
      ...options,
      state: {
        ...state,
        ...(options?.state || {})
      }
    })
  }

  const navigateBack = (fallbackPath: string = defaultFallback) => {
    const state = location.state as NavigationState | undefined

    if (state?.from) {
      const returnUrl = state.from + (state.searchParams || '')
      navigate(returnUrl)
      return
    }

    const searchParams = new URLSearchParams(location.search)
    const returnParam = searchParams.get('return')
    
    if (returnParam) {
      searchParams.delete('return')
      const otherParams = searchParams.toString()
      const returnUrl = returnParam + (otherParams ? `?${otherParams}` : '')
      navigate(returnUrl)
      return
    }

    if (window.history.state?.idx > 0) {
      navigate(-1)
      return
    }

    navigate(fallbackPath)
  }

  const getReturnUrl = (): string => {
    const state = location.state as NavigationState | undefined

    if (state?.from) {
      return state.from + (state.searchParams || '')
    }

    const searchParams = new URLSearchParams(location.search)
    const returnParam = searchParams.get('return')
    
    if (returnParam) {
      searchParams.delete('return')
      const otherParams = searchParams.toString()
      return returnParam + (otherParams ? `?${otherParams}` : '')
    }

    return defaultFallback
  }

  return {
    navigateWithReturn,
    navigateBack,
    getReturnUrl
  }
}

