import { Calendar, MapPin, Link as LinkIcon, BadgeCheck } from 'lucide-react'
import { formatDate } from '@/utils/date'
import type { User } from '@/api/users'

interface ProfileInfoProps {
  user: User
}

export function ProfileInfo({ user }: ProfileInfoProps) {
  return (
    <div className="space-y-1">
      <div className="flex items-center space-x-2">
        <h1 className="text-xl font-bold text-foreground">{user.name}</h1>
        {user.isVerified && (
          <BadgeCheck className="h-5 w-5 text-blue-500" />
        )}
      </div>
      <p className="text-muted-foreground">@{user.username}</p>
      {user.bio && (
        <p className="text-foreground text-sm pt-2">{user.bio}</p>
      )}
      {(user.location || user.website || user.createdAt) && (
        <div className="flex flex-wrap items-center gap-4 gap-y-2 pt-2 text-sm">
          {user.location && (
            <div className="text-muted-foreground flex items-center gap-1 w-full sm:w-auto">
              <MapPin className="h-4 w-4" />
              <span>{user.location}</span>
            </div>
          )}
          {user.website && (
            <div className="flex items-center gap-1 w-full sm:w-auto">
              <LinkIcon className="h-4 w-4 text-muted-foreground" />
              <a
                href={user.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline break-all"
              >
                {user.website}
              </a>
            </div>
          )}
          {user.createdAt && (
            <div className="text-muted-foreground flex items-center gap-1 w-full sm:w-auto">
              <Calendar className="h-4 w-4" />
              <span>Joined {formatDate(user.createdAt)}</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

