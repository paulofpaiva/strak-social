import { useEffect, useState } from 'react'

const MOBILE_BREAKPOINT = 768
const COMPACT_BREAKPOINT = 1024

/**
 * Hook to detect if the viewport is in mobile mode (< 768px)
 * Uses matchMedia for better performance
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < MOBILE_BREAKPOINT
    }
    return false
  })

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener('change', onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  return isMobile
}

/**
 * Hook to detect if the viewport is in compact mode (>= 768px and < 1024px)
 * Useful for tablet/medium screen layouts
 */
export function useIsCompact() {
  const [isCompact, setIsCompact] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= MOBILE_BREAKPOINT && window.innerWidth < COMPACT_BREAKPOINT
    }
    return false
  })

  useEffect(() => {
    const mql = window.matchMedia(`(min-width: ${MOBILE_BREAKPOINT}px) and (max-width: ${COMPACT_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsCompact(window.innerWidth >= MOBILE_BREAKPOINT && window.innerWidth < COMPACT_BREAKPOINT)
    }
    mql.addEventListener('change', onChange)
    setIsCompact(window.innerWidth >= MOBILE_BREAKPOINT && window.innerWidth < COMPACT_BREAKPOINT)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  return isCompact
}
