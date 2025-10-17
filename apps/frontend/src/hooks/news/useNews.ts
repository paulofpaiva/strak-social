import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { getTopHeadlines, type NewsArticle } from '@/api/news'

interface UseNewsOptions {
  pageSize?: number
  country?: string
  category?: string
  page?: number
}

export function useNews({
  pageSize = 10,
  country = 'us',
  category = 'technology'
}: UseNewsOptions = {}) {
  return useInfiniteQuery({
    queryKey: ['news', country, category, pageSize],
    queryFn: ({ pageParam = 1 }) =>
      getTopHeadlines({
        page: pageParam,
        pageSize,
        country,
        category
      }),
    getNextPageParam: (lastPage, allPages) => {
      const totalFetched = allPages.reduce(
        (acc, page) => acc + page.articles.length,
        0
      )
      
      if (totalFetched < lastPage.totalResults) {
        return allPages.length + 1
      }
      
      return undefined
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000
  })
}

export function useNewsArticles(options?: UseNewsOptions) {
  const query = useQuery({
    queryKey: ['news', options?.country, options?.category, options?.pageSize],
    queryFn: () => getTopHeadlines({
      page: 1,
      pageSize: options?.pageSize || 3,
      country: options?.country || 'us',
      category: options?.category || 'general'
    }),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000
  })
  
  return {
    ...query,
    articles: query.data?.articles ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch
  }
}

