import { useMemo, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getUserFollowingApi, toggleFollowApi } from '@/api/follow'
import { useAuth } from '@/hooks'
import { FollowList } from './components/FollowList'
import { FollowListSkeleton } from '../../../components/skeleton/FollowListSkeleton'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { SearchInput } from '@/components/ui/search-input'
import { ErrorEmpty } from '@/components/ErrorEmpty'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import { Spinner } from '@/components/ui/spinner'
import { toast } from 'sonner'

export function Following() {
  const { user } = useAuth()
  const [page, setPage] = useState(1)
  const [limit] = useState(20)
  const [search, setSearch] = useState('')
  const [allUsers, setAllUsers] = useState<any[]>([])
  const [loadingUsers, setLoadingUsers] = useState<Set<string>>(new Set())

  const userId = user?.id || ''
  const queryClient = useQueryClient()

  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ['following', userId, page, limit, search],
    queryFn: () => getUserFollowingApi(userId, page, limit, search || undefined),
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

  const handleToggleFollow = async (userId: string) => {
    setLoadingUsers(prev => new Set(prev).add(userId))
    
    try {
      await toggleFollowApi(userId)
      
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['explore-users'] }),
        queryClient.invalidateQueries({ queryKey: ['profile'] }),
        queryClient.invalidateQueries({ queryKey: ['following'] }),
        queryClient.invalidateQueries({ queryKey: ['followers'] })
      ])
    } catch (error) {
      console.error('Failed to toggle follow:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to update follow status. Please try again.')
    } finally {
      setLoadingUsers(prev => {
        const newSet = new Set(prev)
        newSet.delete(userId)
        return newSet
      })
    }
  }

  return (
    <div className="container mx-auto">
      <Breadcrumb to="/profile" label={`Following`} />

      <div className="mb-4 pt-6 w-full md:w-96">
        <SearchInput
          value={search}
          onChange={handleSearchChange}
          placeholder="Search by name..."
        />
      </div>

      {error && (
        <ErrorEmpty 
          title="Failed to load following"
          description="Unable to load your following list. Please check your connection and try again."
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
            variant="following" 
            hasSearch={search.trim().length > 0}
            showFollowButton={true}
            onToggleFollow={handleToggleFollow}
            loadingUsers={loadingUsers}
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
    </div>
  )
}


