import { useQuery } from '@tanstack/react-query'
import { searchUsersApi } from '@/api/users'
import { SearchInput } from '@/components/ui/search-input'
import { ErrorEmpty } from '@/components/ErrorEmpty'
import { UserListSkeleton } from '../../../components/skeleton/UserListSkeleton'
import { UserList } from './UserList'
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyMedia } from '@/components/ui/empty'
import { Search as SearchIcon } from 'lucide-react'
import { useInfiniteScroll, useSearchNavigation, useInfinitePagination } from '@/hooks'
import { Spinner } from '@/components/ui/spinner'

export function Explore() {
  const { searchParams, navigateWithParams } = useSearchNavigation({
    basePath: '/explore',
    defaultReturnPath: '/explore'
  })

  const search = searchParams.get('q') || ''
  const hasQuery = search.trim().length > 0

  const paginatedData = useInfinitePagination({
    initialPage: 1,
    limit: 20,
  })

  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ['explore-users', search, paginatedData.page, paginatedData.limit],
    queryFn: () => searchUsersApi(search, paginatedData.page, paginatedData.limit),
    enabled: hasQuery,
    retry: false,
    refetchOnWindowFocus: false,
  })

  const { items, hasMore, loadMore, totalItems, reset } = useInfinitePagination({
    data: data?.items,
    currentPage: data?.page,
    hasMore: data?.hasMore,
    isFetching,
    limit: 20,
  })

  const handleSearchChange = (value: string) => {
    navigateWithParams({ q: value.trim() ? value : null })
    reset()
  }

  const setSentinelRef = useInfiniteScroll(
    loadMore,
    hasMore,
    isFetching
  )

  return (
    <>
      <div className="w-full md:w-96">
        <SearchInput
          value={search}
          onChange={handleSearchChange}
          placeholder="Search users..."
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
          <UserList 
            users={items}
            onFollowToggled={(userId, isFollowing) => {
              const updatedItems = items.map(u => u.id === userId ? { ...u, isFollowing } : u)
            }}
          />
          
          {hasQuery && totalItems > 0 && isFetching && (
            <div className="flex justify-center py-4">
              <Spinner size="md" />
            </div>
          )}
          
          {hasQuery && totalItems > 0 && hasMore && (
            <div ref={setSentinelRef} className="h-1" />
          )}
        </>
      )}
    </>
  )
}


