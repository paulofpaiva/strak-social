import { SponsoredContent } from "./SponsoredContent"
import { getRandomAd } from "@/mock/ads"
import { useIsMobile } from "@/hooks/useIsMobile"

export function AdSidebar() {
  const isMobile = useIsMobile()

  if (isMobile) {
    return null
  }

  const sponsoredAd = getRandomAd()
  const promotedAd = getRandomAd()

  return (
    <div className="sticky top-8 space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-4">Sponsored</h3>
        <SponsoredContent {...sponsoredAd} />
      </div>
      
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-4">You might like</h3>
        <SponsoredContent {...promotedAd} />
      </div>
    </div>
  )
}
