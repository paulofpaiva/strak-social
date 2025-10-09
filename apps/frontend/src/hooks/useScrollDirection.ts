import { useEffect, useState } from 'react'

type ScrollDirection = 'up' | 'down' | null

export function useScrollDirection(threshold: number = 10) {
  const [scrollDirection, setScrollDirection] = useState<ScrollDirection>(null)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY || document.documentElement.scrollTop

      if (Math.abs(currentScrollY - lastScrollY) < threshold) {
        return
      }

      if (currentScrollY > lastScrollY && currentScrollY > threshold) {
        setScrollDirection('down')
      } else if (currentScrollY < lastScrollY) {
        setScrollDirection('up')
      }

      setLastScrollY(currentScrollY)
    }

    setLastScrollY(window.scrollY || document.documentElement.scrollTop)

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY, threshold])

  return scrollDirection
}

