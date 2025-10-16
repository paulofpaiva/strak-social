import { useMemo } from 'react'
import { SearchInput } from '@/components/ui/search-input'
import { DiscoverListCard } from '@/components/list/DiscoverListCard'
import { useSearchLists } from '@/hooks/list/useSearchLists'
import { useInfiniteScroll, useSearchNavigation } from '@/hooks'
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyMedia } from '@/components/ui/empty'
import { ErrorEmpty } from '@/components/ErrorEmpty'
import { PostCardSkeleton } from '@/components/skeleton/PostCardSkeleton'
import { List } from '@/api/lists'
import { Compass, Loader2 } from 'lucide-react'

export function DiscoverLists() {
  const { searchParams, navigateWithParams } = useSearchNavigation({
    basePath: '/lists/discover'
  })

  const search = searchParams.get('q') || ''
  const hasQuery = search.trim().length > 0

  const {
    data: searchData,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch
  } = useSearchLists(search)

  const sentinelRef = useInfiniteScroll(
    () => fetchNextPage(),
    hasNextPage || false,
    isFetchingNextPage
  )

  const allLists = useMemo(() => {
    return searchData?.pages.flatMap((page: any) => page.lists) || []
  }, [searchData])

  const lists = Array.from(
    new Map(allLists.map(list => [list.id, list])).values()
  )

  return (
    <>
      <div className="w-full mb-6">
        <SearchInput
          value={search}
          onChange={(value) => navigateWithParams({ q: value.trim() ? value : null })}
          placeholder="Search public lists..."
          className="w-full"
        />
      </div>

      <div className="flex flex-col">
        <div className="p-4 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Compass className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">
              {hasQuery ? `Results for "${search}"` : 'Popular Lists'}
            </h2>
          </div>
          
          {isLoading ? (
            <PostCardSkeleton count={3} />
          ) : isError ? (
            <ErrorEmpty
              title="Failed to load lists"
              description="Unable to load lists. Please try again."
              onRetry={() => refetch()}
              retryText="Try again"
            />
          ) : lists.length === 0 ? (
            <Empty className="mt-8">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Compass className="h-6 w-6" />
                </EmptyMedia>
                <EmptyTitle>
                  {hasQuery ? 'No lists found' : 'No public lists'}
                </EmptyTitle>
                <EmptyDescription>
                  {hasQuery 
                    ? 'Try searching with different terms or explore popular lists.'
                    : 'There are no public lists to discover yet.'
                  }
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <>
              <div className="space-y-3">
                {lists.map((list: List) => (
                  <DiscoverListCard key={list.id} list={list} />
                ))}
              </div>

              {hasNextPage && (
                <div ref={sentinelRef} className="flex justify-center py-4">
                  {isFetchingNextPage && (
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  )
}
