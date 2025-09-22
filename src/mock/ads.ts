import type { SponsoredContentProps } from "@/components/SponsoredContent"

export const mockAds: SponsoredContentProps[] = [
  {
    title: "Boost Your Productivity",
    description: "Discover powerful tools to streamline your workflow and get more done.",
    imageUrl: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop&crop=center",
    ctaText: "Learn More",
    ctaUrl: "https://example.com/productivity",
    sponsor: "Sponsored"
  },
  {
    title: "Join Our Community",
    description: "Connect with like-minded professionals and grow your network.",
    imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop&crop=center",
    ctaText: "Join Now",
    ctaUrl: "https://example.com/community",
    sponsor: "Sponsored"
  },
  {
    title: "Premium Features",
    description: "Unlock advanced features and take your experience to the next level.",
    imageUrl: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=300&fit=crop&crop=center",
    ctaText: "Upgrade",
    ctaUrl: "https://example.com/premium",
    sponsor: "Promoted"
  },
  {
    title: "New Tech Launch",
    description: "Be the first to experience the latest innovation in technology.",
    imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop&crop=center",
    ctaText: "Discover",
    ctaUrl: "https://example.com/tech",
    sponsor: "Sponsored"
  },
  {
    title: "Career Opportunities",
    description: "Find your next dream job with companies hiring now.",
    imageUrl: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400&h=300&fit=crop&crop=center",
    ctaText: "Apply Now",
    ctaUrl: "https://example.com/jobs",
    sponsor: "Promoted"
  }
]

export const getRandomAd = (): SponsoredContentProps => {
  return mockAds[Math.floor(Math.random() * mockAds.length)]
}

export const getSponsoredAds = (): SponsoredContentProps[] => {
  return mockAds.filter(ad => ad.sponsor === "Sponsored")
}

export const getPromotedAds = (): SponsoredContentProps[] => {
  return mockAds.filter(ad => ad.sponsor === "Promoted")
}
