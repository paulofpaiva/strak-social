import { CommentCardSkeleton } from './CommentCardSkeleton'

interface CommentListSkeletonProps {
  count?: number
}

export function CommentListSkeleton({ count = 5 }: CommentListSkeletonProps) {
  return (
    <div className="border-t border-border">
      {Array.from({ length: count }).map((_, index) => (
        <CommentCardSkeleton key={index} />
      ))}
    </div>
  )
}

