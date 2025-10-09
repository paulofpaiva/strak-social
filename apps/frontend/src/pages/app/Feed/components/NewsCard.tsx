import { formatDistanceToNow } from 'date-fns'
import { ExternalLink } from 'lucide-react'
import type { NewsArticle } from '@/api/news'
import { cn } from '@/lib/utils'

interface NewsCardProps {
  article: NewsArticle
  className?: string
}

export function NewsCard({ article, className }: NewsCardProps) {
  const handleClick = () => {
    window.open(article.url, '_blank', 'noopener,noreferrer')
  }

  const publishedDate = article.publishedAt
    ? formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })
    : null

  return (
    <article
      onClick={handleClick}
      className={cn(
        'group cursor-pointer rounded-lg border border-border bg-card p-3 transition-colors hover:bg-accent',
        className
      )}
    >
      {article.urlToImage && (
        <div className="mb-2 overflow-hidden rounded-md">
          <img
            src={article.urlToImage}
            alt={article.title}
            className="aspect-video w-full object-cover transition-transform group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
        </div>
      )}

      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="font-medium">{article.source.name}</span>
          {publishedDate && (
            <>
              <span>•</span>
              <span>{publishedDate}</span>
            </>
          )}
        </div>

        <h3 className="line-clamp-2 font-semibold leading-tight text-foreground group-hover:text-primary">
          {article.title}
        </h3>

        {article.description && (
          <p className="line-clamp-3 text-sm text-muted-foreground">
            {article.description}
          </p>
        )}

        <div className="flex items-center gap-1 text-xs text-primary">
          <span>Read more</span>
          <ExternalLink className="h-3 w-3" />
        </div>
      </div>
    </article>
  )
}

