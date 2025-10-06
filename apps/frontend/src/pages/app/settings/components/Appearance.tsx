import { useTheme, themeOptions } from '@/contexts/ThemeContext'
import { useColor, colorOptions } from '@/contexts/ColorContext'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Palette } from 'lucide-react'

export function Appearance() {
  const { theme, setTheme } = useTheme()
  const { color, setColor } = useColor()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-2">Appearance</h2>
        <p className="text-muted-foreground">
          Customize your app's appearance with different colors and themes.
        </p>
      </div>
      <div>
        <h3 className="text-lg font-medium text-foreground mb-4">Accent Color</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Choose your preferred accent color for buttons, links, and highlights.
        </p>
        <div className="flex flex-wrap gap-3">
          {colorOptions.map((option) => {
            const isActive = color === option.id
            const isDefault = option.id === 'default'
            
            return (
              <button
                key={option.id}
                onClick={() => setColor(option.id)}
                className={`w-12 h-12 rounded-full border-2 transition-all hover:scale-110 cursor-pointer ${
                  isActive 
                    ? 'border-foreground ring-2 ring-primary ring-offset-2' 
                    : 'border-border hover:border-foreground/50'
                }`}
                style={{ backgroundColor: isDefault ? 'transparent' : option.color }}
                title={option.name}
              >
                {isDefault ? (
                  <div className="w-full h-full rounded-full flex items-center justify-center bg-black">
                    <Palette className="w-5 h-5 text-white" />
                  </div>
                ) : isActive ? (
                  <div className="w-full h-full rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  </div>
                ) : null}
              </button>
            )
          })}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-foreground mb-4">Theme</h3>
        <div className="flex flex-wrap gap-2">
          {themeOptions.map((option) => {
            const Icon = option.icon
            const isActive = theme === option.id
            
            return (
              <Button
                key={option.id}
                variant={isActive ? "default" : "outline"}
                className={`flex items-center gap-2 ${
                  isActive 
                    ? 'bg-primary text-primary-foreground' 
                    : ''
                }`}
                onClick={() => setTheme(option.id)}
              >
                <Icon className="h-4 w-4" />
                {option.label}
              </Button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
