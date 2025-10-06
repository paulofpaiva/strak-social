import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { searchUsersApi } from '@/api/users'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { FloatingInput } from '@/components/ui/floating-input'
import { ErrorEmpty } from '@/components/ErrorEmpty'
import { UserListSkeleton } from './components/UserListSkeleton'
import { UserList } from './components/UserList'
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyMedia } from '@/components/ui/empty'
import { Search as SearchIcon } from 'lucide-react'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import { Spinner } from '@/components/ui/spinner'

export function Explore() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [limit] = useState(20)
  const [allUsers, setAllUsers] = useState<Array<{
    id: string
    name: string
    username: string
    avatar?: string | null
    bio?: string | null
    isFollowing?: boolean
  }>>([])

  const hasQuery = search.trim().length > 0

  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ['explore-users', search, page, limit],
    queryFn: () => searchUsersApi(search, page, limit),
    enabled: hasQuery,
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

  return (
    <div className="container mx-auto">
      <Breadcrumb to="/feed" label={`Explore`} />

      <div className="mb-4 mt-16 w-full md:w-96">
        <FloatingInput
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          label="Search users"
        />
      </div>

      {error && (
        <ErrorEmpty 
          title="Failed to search users"
          description="Unable to load users. Please check your connection and try again."
          onRetry={() => refetch()}
          retryText="Try again"
        />
      )}

      {!hasQuery ? (
        <Empty className="mt-8">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <SearchIcon className="h-6 w-6" />
            </EmptyMedia>
            <EmptyTitle>Search users</EmptyTitle>
            <EmptyDescription>Type a name or username to find people.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : isLoading ? (
        <UserListSkeleton />
      ) : (
        <>
          <UserList users={allUsers} />
          
          {hasQuery && allUsers.length > 0 && isFetching && (
            <div className="flex justify-center py-4">
              <Spinner size="md" />
            </div>
          )}
          
          {hasQuery && allUsers.length > 0 && data?.hasMore && (
            <div ref={setSentinelRef} className="h-1" />
          )}
        </>
      )}
    </div>
  )
}


