import { cn } from '@/lib/utils'
import type { PostMedia as PostMediaType } from '@/api/posts'

interface PostMediaProps {
  media: PostMediaType[]
  className?: string
}

export function PostMedia({ media, className }: PostMediaProps) {
  if (!media || media.length === 0) return null

  const sortedMedia = [...media].sort((a, b) => a.order - b.order)

  return (
    <div className={cn('w-full', className)}>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {sortedMedia.slice(0, 6).map((item, index) => (
          <div
            key={item.id}
            className="relative overflow-hidden rounded-lg bg-muted border-2 border-border"
            style={{ height: '120px' }}
          >
            {item.mediaType === 'video' ? (
              <video
                src={item.mediaUrl}
                controls
                className="w-full h-full object-cover"
                preload="metadata"
              >
                Your browser does not support the video tag.
              </video>
            ) : (
              <img
                src={item.mediaUrl}
                alt={`Post media ${index + 1}`}
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
        ))}
      </div>
    </div>
  )
}
