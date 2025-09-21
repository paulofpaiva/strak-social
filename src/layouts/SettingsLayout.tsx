import type { ReactNode } from 'react'
import { AppLayout } from './AppLayout'
import { SettingsTabs } from '@/components/SettingsTabs'
import { SettingsSidebar } from '@/components/SettingsSidebar'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { useIsMobile } from '@/hooks/useIsMobile'

interface SettingsLayoutProps {
  children: ReactNode
  title: string
  description?: string
}

export function SettingsLayout({ children, title, description }: SettingsLayoutProps) {
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <AppLayout>
        <div className="mb-4">
          <div className="flex items-center space-x-4 mb-3">
            <Breadcrumb to="/dashboard" label="Back" />
          </div>
          <h2 className="text-2xl font-bold mb-2">{title}</h2>
          {description && (
            <p className="text-muted-foreground text-sm">{description}</p>
          )}
        </div>

        <div className="space-y-4">
          <SettingsTabs />
          <div className="w-full">
            {children}
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <Breadcrumb to="/dashboard" label="Back" />
        </div>
        <h2 className="text-3xl font-bold mb-2">{title}</h2>
        {description && (
          <p className="text-muted-foreground">{description}</p>
        )}
      </div>

      <div className="flex gap-8">
        <div className="flex-shrink-0">
          <SettingsSidebar />
        </div>
        
        <div className="flex-1 min-w-0">
          {children}
        </div>
      </div>
    </AppLayout>
  )
}
