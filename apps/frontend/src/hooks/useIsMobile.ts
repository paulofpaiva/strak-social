import { useEffect, useState } from "react"

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    // Initialize with current window width if available
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768
    }
    return false
  })

  useEffect(() => {
    const checkIsMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
    }

    // Check on mount
    checkIsMobile()

    // Add event listener
    window.addEventListener("resize", checkIsMobile)

    // Cleanup
    return () => window.removeEventListener("resize", checkIsMobile)
  }, [])

  return isMobile
}

export function useIsCompact() {
  const [isCompact, setIsCompact] = useState<boolean>(() => {
    // Initialize with current window width if available
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 768 && window.innerWidth < 1024
    }
    return false
  })

  useEffect(() => {
    const checkIsCompact = () => {
      const compact = window.innerWidth >= 768 && window.innerWidth < 1024
      setIsCompact(compact)
    }

    // Check on mount
    checkIsCompact()

    // Add event listener
    window.addEventListener("resize", checkIsCompact)

    // Cleanup
    return () => window.removeEventListener("resize", checkIsCompact)
  }, [])

  return isCompact
}
