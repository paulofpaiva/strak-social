import { BadgeCheck } from 'lucide-react'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

interface WhoToFollowCardProps {
  user: {
    id: string
    name: string
    username: string
    avatar: string
    bio: string
    isVerified: boolean
  }
}

export function WhoToFollowCard({ user }: WhoToFollowCardProps) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-border bg-card p-3 hover:bg-accent transition-colors">
      <Avatar src={user.avatar} name={user.name} size="md" />
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1">
          <p className="font-semibold text-sm truncate">{user.name}</p>
          {user.isVerified && (
            <BadgeCheck className="h-4 w-4 text-primary flex-shrink-0" />
          )}
        </div>
        <p className="text-xs text-muted-foreground truncate">@{user.username}</p>
        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
          {user.bio}
        </p>
      </div>
      
      <Button
        size="sm"
        variant="outline"
        className="shrink-0 h-8 px-3 text-xs font-semibold"
      >
        Follow
      </Button>
    </div>
  )
}

