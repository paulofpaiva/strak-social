import { useInfiniteQuery } from '@tanstack/react-query'
import { getListsApi } from '@/api/lists'

export function useLists() {
  return useInfiniteQuery({
    queryKey: ['lists'],
    queryFn: ({ pageParam = 1 }) => getListsApi(pageParam, 20),
    getNextPageParam: (lastPage) => {
      return lastPage.pagination.hasMore 
        ? lastPage.pagination.page + 1 
        : undefined
    },
    initialPageParam: 1,
    retry: false,
    refetchOnWindowFocus: false,
  })
}

