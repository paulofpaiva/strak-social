import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { searchUsersApi } from '@/api/search'
import { Avatar } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, UserPlus } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface UserSearchProps {
  className?: string
}

export function UserSearch({ className }: UserSearchProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  const { data: searchResults, isLoading, error } = useQuery({
    queryKey: ['search-users', debouncedQuery],
    queryFn: () => searchUsersApi(debouncedQuery),
    enabled: debouncedQuery.length > 0,
    staleTime: 30000, // 30 seconds
  })

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleFollow = (userId: string) => {
    console.log('Follow user:', userId)
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex justify-center">
        <div className="relative w-full max-w-2xl">
          <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 h-6 w-6 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-16 pr-6 py-4 text-xl rounded-full border-2 focus:border-primary transition-colors"
          />
        </div>
      </div>

      {debouncedQuery.length > 0 && (
        <div className="flex justify-center">
          <div className="w-full max-w-2xl space-y-3">
          {isLoading && (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center space-x-3 p-3 border border-border rounded-lg animate-pulse">
                  <div className="w-10 h-10 bg-muted rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-1/3"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </div>
                  <div className="w-20 h-8 bg-muted rounded"></div>
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="text-center py-4">
              <p className="text-muted-foreground">Failed to search users</p>
            </div>
          )}

          {searchResults && searchResults.users && searchResults.users.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                Found {searchResults.users.length} user{searchResults.users.length !== 1 ? 's' : ''}
              </h3>
              {searchResults.users.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <Avatar
                      src={user.avatar || undefined}
                      name={user.name}
                      className="w-10 h-10"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold text-foreground truncate">
                          {user.name}
                        </h4>
                        <span className="text-muted-foreground text-sm">
                          @{user.username}
                        </span>
                      </div>
                      {user.bio && (
                        <p className="text-sm text-muted-foreground truncate">
                          {user.bio}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Joined {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleFollow(user.id)}
                    className="ml-2"
                  >
                    <UserPlus className="h-4 w-4 mr-1" />
                    Follow
                  </Button>
                </div>
              ))}
            </div>
          )}

          {searchResults && searchResults.users && searchResults.users.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No users found</p>
            </div>
          )}
          </div>
        </div>
      )}

      {/* Empty State */}
      {debouncedQuery.length === 0 && (
        <div className="text-center py-8">
          <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Search for users by name or username</p>
        </div>
      )}
    </div>
  )
}
