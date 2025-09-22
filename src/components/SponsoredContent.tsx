import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"

export interface SponsoredContentProps {
  title: string
  description: string
  imageUrl?: string
  ctaText: string
  ctaUrl: string
  sponsor?: string
}

export function SponsoredContent({ 
  title, 
  description, 
  imageUrl, 
  ctaText, 
  ctaUrl, 
  sponsor = "Sponsored" 
}: SponsoredContentProps) {
  const handleClick = () => {
    window.open(ctaUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          {imageUrl && (
            <div className="flex-shrink-0">
              <img 
                src={imageUrl} 
                alt={title}
                className="w-12 h-12 rounded-lg object-cover"
              />
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-xs font-medium text-primary">{sponsor}</span>
            </div>
            
            <h3 className="text-sm font-semibold text-foreground mb-1 line-clamp-2">
              {title}
            </h3>
            
            <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
              {description}
            </p>
            
            <Button 
              size="sm"
              onClick={handleClick}
              className="h-7 px-3 text-xs"
            >
              {ctaText}
              <ExternalLink className="h-3 w-3 ml-1" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
