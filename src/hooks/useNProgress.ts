import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import NProgress from 'nprogress'
import '@/styles/nprogress.css'

NProgress.configure({
  showSpinner: false,
  speed: 500,
  minimum: 0.7,
  easing: 'ease',
  trickleSpeed: 10,
})

export const useNProgress = () => {
  const location = useLocation()
  const prevLocationRef = useRef(location.pathname)
  const isInitialLoad = useRef(true)

  useEffect(() => {
    if (isInitialLoad.current) {
      NProgress.start()
      
      const timer = setTimeout(() => {
        NProgress.done()
        isInitialLoad.current = false
      }, 200)

      return () => {
        clearTimeout(timer)
        NProgress.done()
      }
    }

    if (prevLocationRef.current !== location.pathname) {
      NProgress.start()
      
      const timer = setTimeout(() => {
        NProgress.done()
        prevLocationRef.current = location.pathname
      }, 300)

      return () => {
        clearTimeout(timer)
        NProgress.done()
      }
    }
  }, [location.pathname])

  return null
}