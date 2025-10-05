import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useTheme } from "@/contexts/ThemeContext"
import { Monitor, Sun, Moon } from "lucide-react"

export function AppearanceSettings() {
  const { theme, setTheme } = useTheme()

  const themes = [
    {
      id: 'light' as const,
      name: 'Light',
      icon: Sun,
      preview: 'bg-white border-gray-200',
      description: 'Light mode'
    },
    {
      id: 'dark' as const,
      name: 'Dark', 
      icon: Moon,
      preview: 'bg-gray-900 border-gray-700',
      description: 'Dark mode'
    },
    {
      id: 'system' as const,
      name: 'System',
      icon: Monitor,
      preview: 'bg-gradient-to-br from-white to-gray-900 border-gray-400',
      description: 'Use system setting'
    }
  ]

  return (
    <Card className="bg-background">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Monitor className="h-5 w-5 mr-2" />
          Appearance
        </CardTitle>
        <CardDescription>
          Customize how the application looks and feels.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Theme</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Select the theme for the feed.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {themes.map((themeOption) => {
              const Icon = themeOption.icon
              const isSelected = theme === themeOption.id
              
              return (
                <div
                  key={themeOption.id}
                  className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all ${
                    isSelected 
                      ? 'border-primary ring-2 ring-primary ring-opacity-50' 
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => setTheme(themeOption.id)}
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{themeOption.name}</span>
                  </div>
                  
                  <div className={`w-full h-20 rounded border ${themeOption.preview} relative overflow-hidden`}>
                    <div className="absolute top-2 left-2 right-2 h-2 bg-gray-300 rounded"></div>
                    <div className="absolute top-6 left-2 w-8 h-8 bg-gray-400 rounded-full"></div>
                    <div className="absolute top-6 left-12 right-2 h-2 bg-gray-300 rounded"></div>
                    <div className="absolute top-10 left-2 right-2 h-2 bg-gray-300 rounded"></div>
                    <div className="absolute top-14 left-2 w-6 h-6 bg-gray-400 rounded"></div>
                    <div className="absolute top-14 left-10 right-2 h-2 bg-gray-300 rounded"></div>
                  </div>
                  
                  <p className="text-xs text-muted-foreground mt-2">{themeOption.description}</p>
                  
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-primary-foreground rounded-full"></div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}