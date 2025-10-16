import { useInfiniteQuery } from '@tanstack/react-query'
import { searchListsApi } from '@/api/lists'

export function useSearchLists(query: string, limit: number = 20) {
  return useInfiniteQuery({
    queryKey: ['search-lists', query],
    queryFn: ({ pageParam = 1 }) => searchListsApi(query, pageParam as number, limit),
    initialPageParam: 1,
    retry: false,
    refetchOnWindowFocus: false,
    getNextPageParam: (lastPage: any) => {
      return lastPage.pagination.hasMore ? lastPage.pagination.page + 1 : undefined
    },
  })
}

