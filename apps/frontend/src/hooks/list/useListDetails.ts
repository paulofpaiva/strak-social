import { useQuery, useInfiniteQuery } from '@tanstack/react-query'
import { getListByIdApi, getListMembersApi } from '@/api/lists'

export function useListDetails(listId: string | undefined) {
  return useQuery({
    queryKey: ['list', listId],
    queryFn: () => getListByIdApi(listId!),
    enabled: !!listId,
    retry: false,
    refetchOnWindowFocus: false,
  })
}

export function useListMembers(listId: string | undefined, searchQuery?: string) {
  return useInfiniteQuery({
    queryKey: ['list-members', listId, searchQuery],
    queryFn: ({ pageParam = 1 }) => getListMembersApi(listId!, pageParam, 20, searchQuery),
    getNextPageParam: (lastPage) => {
      return lastPage.pagination.hasMore 
        ? lastPage.pagination.page + 1 
        : undefined
    },
    initialPageParam: 1,
    enabled: !!listId,
    retry: false,
    refetchOnWindowFocus: false,
  })
}

