import type { NavigateFunction } from 'react-router-dom'
import { useEffect } from 'react'

const NAVIGATION_KEY = 'app_navigation_history'

interface NavigationEntry {
  path: string
  timestamp: number
  referrer?: string
}

class NavigationManager {
  private getHistory(): NavigationEntry[] {
    try {
      const stored = sessionStorage.getItem(NAVIGATION_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }

  private setHistory(history: NavigationEntry[]): void {
    try {
      const trimmed = history.slice(-10)
      sessionStorage.setItem(NAVIGATION_KEY, JSON.stringify(trimmed))
    } catch {
    }
  }

  recordNavigation(path: string, referrer?: string): void {
    const history = this.getHistory()
    const entry: NavigationEntry = {
      path,
      timestamp: Date.now(),
      referrer: referrer || document.referrer
    }
    
    history.push(entry)
    this.setHistory(history)
    
    this.resetScroll()
  }

  private resetScroll(): void {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    })
  }

  getPreviousPage(currentPath: string): string | null {
    const history = this.getHistory()
    
    const filtered = history
      .filter(entry => entry.path !== currentPath)
      .sort((a, b) => b.timestamp - a.timestamp)
    
    return filtered.length > 0 ? filtered[0].path : null
  }

  cameFromPattern(pattern: string): boolean {
    const history = this.getHistory()
    if (history.length < 2) return false
    
    const previous = history[history.length - 2]
    return previous ? previous.path.includes(pattern) : false
  }

  clearHistory(): void {
    try {
      sessionStorage.removeItem(NAVIGATION_KEY)
    } catch {
    }
  }
}

export const navigationManager = new NavigationManager()

export const createSmartNavigationHandler = (
  navigate: NavigateFunction,
  currentPath: string,
  fallbackPath: string = '/feed'
) => {
  return (avoidPatterns: string[] = []) => {
    const shouldAvoidBack = avoidPatterns.some(pattern => 
      navigationManager.cameFromPattern(pattern)
    )

    if (shouldAvoidBack) {
      navigate(fallbackPath)
      navigationManager.recordNavigation(fallbackPath)
      return
    }

    const previousPage = navigationManager.getPreviousPage(currentPath)
    
    if (previousPage) {
      navigate(previousPage)
      navigationManager.recordNavigation(previousPage)
    } else {
      if (window.history.length > 1) {
        navigate(-1)
      } else {
        navigate(fallbackPath)
        navigationManager.recordNavigation(fallbackPath)
      }
    }
  }
}

export const useNavigationTracking = (path: string) => {
  useEffect(() => {
    navigationManager.recordNavigation(path)
  }, [path])
}

export const trackNavigation = (path: string) => {
  navigationManager.recordNavigation(path)
}

export const navigateWithScrollReset = (navigate: NavigateFunction, path: string) => {
  navigate(path)
  navigationManager.recordNavigation(path)
}
