import { useInfiniteQuery } from '@tanstack/react-query'
import { getListPostsApi } from '@/api/lists'

export function useListPosts(listId: string | undefined) {
  return useInfiniteQuery({
    queryKey: ['listPosts', listId],
    queryFn: ({ pageParam = 1 }) => getListPostsApi(listId!, pageParam as number),
    initialPageParam: 1,
    enabled: !!listId,
    retry: false,
    refetchOnWindowFocus: false,
    getNextPageParam: (lastPage: any) => {
      return lastPage.pagination.hasMore ? lastPage.pagination.page + 1 : undefined
    },
  })
}
