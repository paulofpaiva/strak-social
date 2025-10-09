import { useEffect } from 'react'
import { X } from 'lucide-react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Keyboard } from 'swiper/modules'
import type { MediaItem } from './post/PostMedia'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

interface MediaViewerProps {
  media: MediaItem[]
  initialIndex?: number
  isOpen: boolean
  onClose: () => void
}

export function MediaViewer({ media, initialIndex = 0, isOpen, onClose }: MediaViewerProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const sortedMedia = [...media].sort((a, b) => a.order - b.order)

  return (
    <div 
      className="fixed inset-0 z-60 bg-black/95 flex items-center justify-center"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-70 text-white hover:text-gray-300 transition-colors p-2 rounded-full hover:bg-white/10"
        aria-label="Close viewer"
      >
        <X className="h-6 w-6" />
      </button>

      <div 
        className="w-full h-full flex items-center justify-center px-4 md:px-16"
        onClick={(e) => e.stopPropagation()}
      >
        <Swiper
          modules={[Navigation, Pagination, Keyboard]}
          navigation
          pagination={{ clickable: true }}
          keyboard={{ enabled: true }}
          initialSlide={initialIndex}
          loop={false}
          className="w-full h-full max-w-7xl"
          style={{
            '--swiper-navigation-color': '#fff',
            '--swiper-pagination-color': '#fff',
          } as React.CSSProperties}
        >
          {sortedMedia.map((item) => (
            <SwiperSlide 
              key={item.id}
              className="flex items-center justify-center"
            >
              <div className="flex items-center justify-center w-full h-full p-4">
                {item.mediaType === 'video' ? (
                  <video
                    src={item.mediaUrl}
                    controls
                    className="max-w-full max-h-full object-contain"
                    autoPlay
                  >
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <img
                    src={item.mediaUrl}
                    alt="Media"
                    className="max-w-full max-h-full object-contain"
                    loading="lazy"
                  />
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  )
}

