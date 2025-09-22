interface MediaItem {
  id: string
  mediaUrl: string
  mediaType: string
  order: number
}

interface MediaGridProps {
  media: MediaItem[]
  onImageClick?: (imageUrl: string, e: React.MouseEvent) => void
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'full'
  className?: string
}

export function MediaGrid({ 
  media, 
  onImageClick, 
  maxWidth = 'md',
  className = '' 
}: MediaGridProps) {
  if (!media || media.length === 0) return null

  const maxWidthClass = {
    xs: 'max-w-xs',
    sm: 'max-w-sm', 
    md: 'max-w-md',
    lg: 'max-w-lg',
    full: 'w-full'
  }[maxWidth]

  const handleMediaClick = (mediaUrl: string, e: React.MouseEvent) => {
    e.stopPropagation()
    onImageClick?.(mediaUrl, e)
  }

  if (media.length === 1) {
    const item = media[0]
    return (
      <div className={`mb-3 ${className}`}>
        {(item.mediaType === 'image' || item.mediaType === 'gif') ? (
          <img
            src={item.mediaUrl}
            alt="Media"
            className={`w-full ${maxWidthClass} rounded-xl cursor-pointer hover:opacity-90 transition-opacity`}
            onClick={(e) => handleMediaClick(item.mediaUrl, e)}
          />
        ) : (
          <video
            src={item.mediaUrl}
            controls
            className={`w-full ${maxWidthClass} rounded-xl`}
          />
        )}
      </div>
    )
  }

  if (media.length === 2) {
    return (
      <div className={`mb-3 ${className}`}>
        <div className={`grid grid-cols-2 ${maxWidthClass} rounded-xl overflow-hidden`}>
          {media.slice(0, 2).map((item, index) => (
            <div key={item.id}>
              {(item.mediaType === 'image' || item.mediaType === 'gif') ? (
                <img
                  src={item.mediaUrl}
                  alt={`Media ${index + 1}`}
                  className="w-full h-48 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={(e) => handleMediaClick(item.mediaUrl, e)}
                />
              ) : (
                <video
                  src={item.mediaUrl}
                  controls
                  className="w-full h-48 object-cover"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (media.length === 3) {
    return (
      <div className={`mb-3 ${className}`}>
        <div className={`grid grid-cols-2 ${maxWidthClass} rounded-xl overflow-hidden`}>
          <div>
            {media[0].mediaType === 'image' || media[0].mediaType === 'gif' ? (
              <img
                src={media[0].mediaUrl}
                alt="Media 1"
                className="w-full h-48 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                onClick={(e) => handleMediaClick(media[0].mediaUrl, e)}
              />
            ) : (
              <video
                src={media[0].mediaUrl}
                controls
                className="w-full h-48 object-cover"
              />
            )}
          </div>
          <div className="grid grid-rows-2">
            {media.slice(1, 3).map((item, index) => (
              <div key={item.id}>
                {(item.mediaType === 'image' || item.mediaType === 'gif') ? (
                  <img
                    src={item.mediaUrl}
                    alt={`Media ${index + 2}`}
                    className="w-full h-24 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={(e) => handleMediaClick(item.mediaUrl, e)}
                  />
                ) : (
                  <video
                    src={item.mediaUrl}
                    controls
                    className="w-full h-24 object-cover"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`mb-3 ${className}`}>
      <div className={`grid grid-cols-2 ${maxWidthClass} rounded-xl overflow-hidden`}>
        {media.slice(0, 4).map((item, index) => (
          <div key={item.id} className="relative">
            {(item.mediaType === 'image' || item.mediaType === 'gif') ? (
              <img
                src={item.mediaUrl}
                alt={`Media ${index + 1}`}
                className="w-full h-32 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                onClick={(e) => handleMediaClick(item.mediaUrl, e)}
              />
            ) : (
              <video
                src={item.mediaUrl}
                controls
                className="w-full h-32 object-cover"
              />
            )}
            {media.length > 4 && index === 3 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white font-semibold">
                  +{media.length - 4}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
