import { cn } from '@/lib/utils'
import { Play } from 'lucide-react'

export interface MediaItem {
  id: string
  mediaUrl: string
  mediaType: 'image' | 'video' | 'gif'
  order: number
}

interface PostMediaProps {
  media: MediaItem[]
  className?: string
  isPostView?: boolean
  onMediaClick?: (index: number) => void
}

export function PostMedia({ media, className, isPostView = false, onMediaClick }: PostMediaProps) {
  if (!media || media.length === 0) return null

  const sortedMedia = [...media].sort((a, b) => a.order - b.order)
  const isSingle = sortedMedia.length === 1

  if (isSingle) {
    const item = sortedMedia[0]
    const handleClick = () => {
      if (isPostView && onMediaClick) {
        onMediaClick(0)
      }
    }

    return (
      <div className={cn('w-full flex justify-center md:justify-start', className)}>
        <div 
          className={cn(
            'relative w-full max-w-[280px] md:max-w-xs',
            isPostView && onMediaClick && 'cursor-pointer'
          )}
          onClick={handleClick}
        >
          {item.mediaType === 'video' ? (
            <div className="relative">
              <video
                src={item.mediaUrl}
                className="w-full h-auto max-h-[320px] object-contain"
                preload="metadata"
              >
                Your browser does not support the video tag.
              </video>
              {isPostView ? (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors">
                  <div className="bg-white/90 rounded-full p-4">
                    <Play className="h-8 w-8 text-black fill-black" />
                  </div>
                </div>
              ) : (
                <div className="absolute top-2 right-2 bg-black/70 rounded-full p-2">
                  <Play className="h-4 w-4 text-white fill-white" />
                </div>
              )}
            </div>
          ) : (
            <img
              src={item.mediaUrl}
              alt="Media"
              className="w-full h-auto max-h-[320px] object-contain"
              loading="lazy"
            />
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={cn('w-full', className)}>
      <div className="grid gap-2 grid-cols-2 sm:grid-cols-3">
        {sortedMedia.slice(0, 6).map((item, index) => {
          const handleClick = () => {
            if (isPostView && onMediaClick) {
              onMediaClick(index)
            }
          }

          return (
            <div
              key={item.id}
              className={cn(
                'relative overflow-hidden rounded-lg bg-muted border-2 border-border',
                isPostView && onMediaClick && 'cursor-pointer'
              )}
              style={{ height: '120px' }}
              onClick={handleClick}
            >
              {item.mediaType === 'video' ? (
                <div className="relative w-full h-full">
                  <video
                    src={item.mediaUrl}
                    className="w-full h-full object-cover"
                    preload="metadata"
                  >
                    Your browser does not support the video tag.
                  </video>
                  {isPostView ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors">
                      <div className="bg-white/90 rounded-full p-3">
                        <Play className="h-6 w-6 text-black fill-black" />
                      </div>
                    </div>
                  ) : (
                    <div className="absolute top-2 right-2 bg-black/70 rounded-full p-1.5">
                      <Play className="h-3.5 w-3.5 text-white fill-white" />
                    </div>
                  )}
                </div>
              ) : (
                <img
                  src={item.mediaUrl}
                  alt={`Media ${index + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              )}
              
              {sortedMedia.length > 6 && index === 5 && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <span className="text-white text-xl font-bold">
                    +{sortedMedia.length - 6}
                  </span>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
