import { useState, useMemo } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getUserFollowersApi, removeFollowerApi } from '@/api/follow'
import { useAuth } from '@/hooks'
import { useParams } from 'react-router-dom'
import { getUserByUsernameApi } from '@/api/users'
import { FollowList } from './components/FollowList'
import { FollowListSkeleton } from '../../../components/skeleton/FollowListSkeleton'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { SearchInput } from '@/components/ui/search-input'
import { ErrorEmpty } from '@/components/ErrorEmpty'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import { Spinner } from '@/components/ui/spinner'
import { toast } from 'sonner'

export function Followers() {
  const { username } = useParams<{ username: string }>()
  const { user: currentUser } = useAuth()
  const [page, setPage] = useState(1)
  const [limit] = useState(20)
  const [search, setSearch] = useState('')
  const [allUsers, setAllUsers] = useState<any[]>([])
  const [loadingUsers, setLoadingUsers] = useState<Set<string>>(new Set())

  const queryClient = useQueryClient()
  
  const { data: userData, isLoading: isLoadingUser } = useQuery({
    queryKey: ['user-profile', username],
    queryFn: () => getUserByUsernameApi(username!),
    enabled: !!username,
    retry: false,
    refetchOnWindowFocus: false,
  })

  const userId = userData?.id || ''
  const isOwnProfile = currentUser?.username === username

  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ['followers', userId, page, limit, search],
    queryFn: () => getUserFollowersApi(userId, page, limit, search || undefined),
    enabled: !!userId,
    retry: false,
    refetchOnWindowFocus: false,
  })

  useMemo(() => {
    if (data?.items) {
      if (page === 1) {
        setAllUsers(data.items)
      } else {
        setAllUsers(prev => [...prev, ...data.items])
      }
    }
  }, [data?.items, page])

  const handleSearchChange = (value: string) => {
    setSearch(value)
    setPage(1)
    setAllUsers([])
  }

  const loadMore = () => {
    if (data?.hasMore && !isFetching) {
      setPage(prev => prev + 1)
    }
  }

  const setSentinelRef = useInfiniteScroll(
    loadMore,
    data?.hasMore || false,
    isFetching
  )

  const handleRemoveFollower = async (userId: string) => {
    setLoadingUsers(prev => new Set(prev).add(userId))
    
    try {
      await removeFollowerApi(userId)
      
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['explore-users'] }),
        queryClient.invalidateQueries({ queryKey: ['profile'] }),
        queryClient.invalidateQueries({ queryKey: ['following'] }),
        queryClient.invalidateQueries({ queryKey: ['followers'] })
      ])
    } catch (error) {
      console.error('Failed to remove follower:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to remove follower. Please try again.')
    } finally {
      setLoadingUsers(prev => {
        const newSet = new Set(prev)
        newSet.delete(userId)
        return newSet
      })
    }
  }

  if (isLoadingUser) {
    return <FollowListSkeleton />
  }

  return (
    <>
      <Breadcrumb to={`/${username}`} label={`Followers`} />

      <div className="pt-5 w-full md:w-96">
        <SearchInput
          value={search}
          onChange={handleSearchChange}
          placeholder="Search by name..."
        />
      </div>

      {error && (
        <ErrorEmpty 
          title="Failed to load followers"
          description="Unable to load your followers list. Please check your connection and try again."
          onRetry={() => refetch()}
          retryText="Try again"
        />
      )}

      {isLoading ? (
        <FollowListSkeleton />
      ) : (
        <>
          <FollowList 
            users={allUsers} 
            variant="followers" 
            hasSearch={search.trim().length > 0}
            onRemoveFollower={isOwnProfile ? handleRemoveFollower : undefined}
            loadingUsers={loadingUsers}
            isOwnProfile={isOwnProfile}
            currentUserId={currentUser?.id}
          />
          
          {allUsers.length > 0 && isFetching && (
            <div className="flex justify-center py-4">
              <Spinner size="md" />
            </div>
          )}
          
          {allUsers.length > 0 && data?.hasMore && (
            <div ref={setSentinelRef} className="h-1" />
          )}
        </>
      )}
    </>
  )
}


