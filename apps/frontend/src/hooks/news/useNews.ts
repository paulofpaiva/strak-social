import { useInfiniteQuery } from '@tanstack/react-query'
import { getTopHeadlines, type NewsArticle } from '@/api/news'

interface UseNewsOptions {
  pageSize?: number
  country?: string
  category?: string
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
  const query = useNews(options)
  
  const allArticles = query.data?.pages.flatMap((page) => page.articles) ?? []
  const articles: NewsArticle[] = Array.from(
    new Map(allArticles.map(article => [article.url, article])).values()
  )
  
  return {
    ...query,
    articles
  }
}

