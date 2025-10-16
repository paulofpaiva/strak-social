import { Link, useNavigate } from 'react-router-dom'
import { List } from '@/api/lists'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Lock, NotebookText, Plus, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { useFollowList } from '@/hooks/list/useListMutations'

interface DiscoverListCardProps {
  list: List
  className?: string
}

export function DiscoverListCard({ list, className }: DiscoverListCardProps) {
  const navigate = useNavigate()
  const [isFollowing, setIsFollowing] = useState(false)
  const followListMutation = useFollowList()

  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('[data-button]')) {
      e.preventDefault()
      return
    }
    navigate(`/lists/${list.id}`)
  }

  const handleFollowClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    try {
      setIsFollowing(true)
      await followListMutation.mutateAsync(list.id)
    } catch (error) {
    } finally {
      setIsFollowing(false)
    }
  }

  const showFollowButton = !list.isOwner && !list.isMember

  return (
    <div
      onClick={handleCardClick}
      className={cn(
        "block border rounded-lg overflow-hidden hover:bg-accent/50 transition-colors cursor-pointer",
        className
      )}
    >
      <div className="flex gap-4 p-4">
        <div className="flex-shrink-0">
          <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted">
            {list.coverUrl ? (
              <img 
                src={list.coverUrl} 
                alt={list.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <NotebookText className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2 mb-1">
            <h3 className="font-semibold text-base truncate flex-1">
              {list.title}
              <span className="text-sm text-muted-foreground font-normal"> · {list.membersCount} {list.membersCount === 1 ? 'member' : 'members'}</span>
            </h3>
            <div className="flex items-center gap-1 flex-shrink-0">
              {list.isPrivate && (
                <Lock className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
          </div>
          
          {list.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
              {list.description}
            </p>
          )}

          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Avatar 
              src={list.owner.avatar || undefined} 
              name={list.owner.name}
              size="sm"
              className="h-4 w-4 text-[10px]"
            />
            <span>@{list.owner.username}</span>
          </div>
        </div>

        {showFollowButton && (
          <div className="flex-shrink-0 flex items-center">
            <Button
              size="sm"
              variant="outline"
              onClick={handleFollowClick}
              disabled={isFollowing || followListMutation.isPending}
              data-button
              className="h-8 w-8 p-0"
            >
             <Plus className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
