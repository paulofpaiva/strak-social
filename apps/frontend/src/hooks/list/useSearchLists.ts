import { useQuery } from '@tanstack/react-query'
import { searchListsApi } from '@/api/lists'

export function useSearchLists(query: string, page: number = 1, limit: number = 20) {
  return useQuery({
    queryKey: ['search-lists', query, page],
    queryFn: () => searchListsApi(query, page, limit),
    enabled: query.trim().length > 0,
    retry: false,
    refetchOnWindowFocus: false,
  })
}

