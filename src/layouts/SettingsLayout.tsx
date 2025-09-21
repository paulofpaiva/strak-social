import type { ReactNode } from 'react'
import { AppLayout } from './AppLayout'
import { SettingsSidebar } from '@/components/SettingsSidebar'
import { Breadcrumb } from '@/components/ui/breadcrumb'

interface SettingsLayoutProps {
  children: ReactNode
  title: string
  description?: string
}

export function SettingsLayout({ children, title, description }: SettingsLayoutProps) {
  return (
    <AppLayout>
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <Breadcrumb to="/dashboard" label="Back" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">{title}</h2>
        {description && (
          <p className="text-gray-400">{description}</p>
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
