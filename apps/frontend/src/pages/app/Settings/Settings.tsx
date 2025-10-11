import { Shield, Palette } from 'lucide-react'
import { ResponsiveTabs } from '../../../components/ui/responsive-tabs-sidebar'
import { Account } from './components/Account'
import { Appearance } from './components/Appearance'
import { useTabNavigation } from '@/hooks/useTabNavigation'

export function Settings() {
  const { activeTab, handleTabChange } = useTabNavigation({
    defaultTab: 'account',
    validTabs: ['account', 'appearance'],
    basePath: '/settings'
  })

  const tabs = [
    {
      id: 'account',
      label: 'Account',
      icon: Shield,
      content: <Account />
    },
    {
      id: 'appearance',
      label: 'Appearance',
      icon: Palette,
      content: <Appearance />
    }
  ]

  return (
    <>
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your settings and preferences here.
        </p>
      </div>

      <div className="mt-8">
        <ResponsiveTabs 
          activeTab={activeTab} 
          onTabChange={handleTabChange}
          tabs={tabs}
        />
      </div>
    </>
  )
}
