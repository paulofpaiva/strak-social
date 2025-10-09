import { useEffect, useRef, useState, useCallback } from 'react'

interface UsePullToRefreshOptions {
  onRefresh: () => Promise<void>
  pullDownThreshold?: number
  maxPullDown?: number
  refreshing?: boolean
}

export function usePullToRefresh({
  onRefresh,
  pullDownThreshold = 80,
  maxPullDown = 150,
  refreshing: externalRefreshing = false,
}: UsePullToRefreshOptions) {
  const [pullDistance, setPullDistance] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const startY = useRef(0)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsRefreshing(externalRefreshing)
  }, [externalRefreshing])

  const handleTouchStart = useCallback((e: TouchEvent) => {
    const container = containerRef.current
    if (!container) return
    
    // Only trigger if at the top of the scroll container
    if (container.scrollTop === 0) {
      startY.current = e.touches[0].clientY
      setIsDragging(true)
    }
  }, [])

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging || isRefreshing) return

    const currentY = e.touches[0].clientY
    const distance = currentY - startY.current

    if (distance > 0) {
      // Prevent default scroll behavior when pulling down
      e.preventDefault()
      const newDistance = Math.min(distance * 0.5, maxPullDown)
      setPullDistance(newDistance)
    }
  }, [isDragging, isRefreshing, maxPullDown])

  const handleTouchEnd = useCallback(async () => {
    if (!isDragging) return
    
    setIsDragging(false)

    if (pullDistance >= pullDownThreshold && !isRefreshing) {
      setIsRefreshing(true)
      setPullDistance(pullDownThreshold)
      
      try {
        await onRefresh()
      } finally {
        setIsRefreshing(false)
        setPullDistance(0)
      }
    } else {
      setPullDistance(0)
    }
  }, [isDragging, isRefreshing, pullDistance, pullDownThreshold, onRefresh])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.addEventListener('touchstart', handleTouchStart, { passive: true })
    container.addEventListener('touchmove', handleTouchMove, { passive: false })
    container.addEventListener('touchend', handleTouchEnd)

    return () => {
      container.removeEventListener('touchstart', handleTouchStart)
      container.removeEventListener('touchmove', handleTouchMove)
      container.removeEventListener('touchend', handleTouchEnd)
    }
  }, [handleTouchStart, handleTouchMove, handleTouchEnd])

  const pullProgress = Math.min(pullDistance / pullDownThreshold, 1)
  const showRefreshIndicator = pullDistance > 10 || isRefreshing

  return {
    containerRef,
    pullDistance,
    pullProgress,
    isRefreshing,
    showRefreshIndicator,
    isDragging,
  }
}
