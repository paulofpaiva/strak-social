import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

interface UseTabNavigationOptions {
  defaultTab: string
  validTabs: string[]
  basePath: string
}

export function useTabNavigation({ defaultTab, validTabs, basePath }: UseTabNavigationOptions) {
  const { tab } = useParams<{ tab?: string }>()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState(defaultTab)

  useEffect(() => {
    if (tab && validTabs.includes(tab)) {
      setActiveTab(tab)
    } else if (!tab) {
      navigate(`${basePath}/${defaultTab}`, { replace: true })
    }
  }, [tab, validTabs, defaultTab, basePath, navigate])

  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab)
    navigate(`${basePath}/${newTab}`)
  }

  return {
    activeTab,
    handleTabChange
  }
}
