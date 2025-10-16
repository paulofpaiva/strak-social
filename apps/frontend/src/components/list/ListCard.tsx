import { Link, useNavigate } from 'react-router-dom'
import { List } from '@/api/lists'
import { Avatar } from '@/components/ui/avatar'
import { Lock, NotebookText } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

interface ListCardProps {
  list: List
  className?: string
}

export function ListCard({ list, className }: ListCardProps) {
  const navigate = useNavigate()

  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('[data-dropdown-trigger]')) {
      e.preventDefault()
      return
    }
    navigate(`/lists/${list.id}`)
  }

  return (
    <>
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
              className="h-4 w-4"
            />
            <span>@{list.owner.username}</span>
          </div>
        </div>
        </div>
      </div>
    </>
  )
}

