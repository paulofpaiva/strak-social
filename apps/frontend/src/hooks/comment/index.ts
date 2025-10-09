import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { getPostComments, getCommentReplies } from '@/api/comments'

export * from './useCommentForm'
export * from './useCommentMutation'

export function usePostComments(postId: string) {
  return useInfiniteQuery({
    queryKey: ['comments', postId],
    queryFn: ({ pageParam = 1 }) => getPostComments(postId, pageParam, 10),
    getNextPageParam: (lastPage) => {
      return lastPage.pagination.hasMore 
        ? lastPage.pagination.page + 1 
        : undefined
    },
    initialPageParam: 1,
    enabled: !!postId,
  })
}

export function useCommentReplies(commentId: string, page: number = 1, enabled: boolean = true) {
  return useQuery({
    queryKey: ['comment-replies', commentId, page],
    queryFn: () => getCommentReplies(commentId, page, 5),
    enabled: enabled && !!commentId,
  })
}

