import { useEffect, useState } from "react"

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
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

    checkIsMobile()

    window.addEventListener("resize", checkIsMobile)

    return () => window.removeEventListener("resize", checkIsMobile)
  }, [])

  return isMobile
}

export function useIsCompact() {
  const [isCompact, setIsCompact] = useState<boolean>(() => {
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

    checkIsCompact()

    window.addEventListener("resize", checkIsCompact)

    return () => window.removeEventListener("resize", checkIsCompact)
  }, [])

  return isCompact
}
