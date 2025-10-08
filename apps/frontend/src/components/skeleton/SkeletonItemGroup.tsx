import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  Item, 
  ItemContent, 
  ItemDescription, 
  ItemTitle,
  ItemGroup,
  ItemSeparator,
  ItemActions
} from '@/components/ui/item'

interface SkeletonItemGroupProps {
  itemCount?: number
  className?: string
}

export function SkeletonItemGroup({ 
  itemCount = 3, 
  className 
}: SkeletonItemGroupProps) {
  return (
    <ItemGroup className={className}>
        {Array.from({ length: itemCount }).map((_, index) => (
        <React.Fragment key={index}>
          <Item>
            <ItemContent>
              <ItemTitle>
                <Skeleton className="h-5 w-32" />
              </ItemTitle>
              <div className="text-muted-foreground line-clamp-2 text-sm leading-normal font-normal text-balance">
                <Skeleton className="h-4 w-48 mt-1" />
              </div>
            </ItemContent>
            <ItemActions>
              <Skeleton className="h-4 w-4" />
            </ItemActions>
          </Item>
          {index !== itemCount - 1 && <ItemSeparator />}
        </React.Fragment>
      ))}
    </ItemGroup>
  )
}
