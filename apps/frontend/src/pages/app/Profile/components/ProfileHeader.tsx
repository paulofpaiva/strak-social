import { useState } from 'react'
import { Avatar } from '@/components/ui/avatar'
import { AvatarEditor } from './Avatar'
import { CoverEditor } from './Cover'
import type { User } from '@/api/users'

interface ProfileHeaderProps {
  user: User
  isOwnProfile: boolean
}

export function ProfileHeader({ user, isOwnProfile }: ProfileHeaderProps) {
  const [imageLoading, setImageLoading] = useState(user.cover ? true : false)

  return (
    <div className="relative -mx-4 sm:mx-0">
      {isOwnProfile ? (
        <CoverEditor 
          src={user.cover ?? undefined} 
          className="h-48 sm:h-48 md:h-64 w-full"
        />
      ) : (
        <div className="h-48 sm:h-48 md:h-64 w-full bg-gray-800 overflow-hidden relative">
          {user.cover ? (
            <>
              {imageLoading && (
                <div className="absolute inset-0 bg-gradient-to-r from-gray-700 to-gray-600 animate-pulse"></div>
              )}
              <img
                src={user.cover}
                alt={`${user.name} cover`}
                className="w-full h-full object-cover"
                loading="eager"
                decoding="async"
                onLoad={() => setImageLoading(false)}
                onError={() => setImageLoading(false)}
              />
            </>
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-gray-700 to-gray-600" />
          )}
        </div>
      )}
      
      <div className="absolute -bottom-12 sm:-bottom-16 left-4 sm:left-6">
        {isOwnProfile ? (
          <AvatarEditor 
            src={user.avatar ?? undefined} 
            name={user.name} 
            size="2xl"
            className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40"
          />
        ) : (
          <Avatar 
            src={user.avatar ?? undefined} 
            name={user.name} 
            size="2xl"
            className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40"
          />
        )}
      </div>
    </div>
  )
}

