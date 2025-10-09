import React, { createContext, useContext, useEffect, useState } from 'react'

type Color = 'default' | 'blue' | 'green' | 'purple' | 'red' | 'orange' | 'pink'

interface ColorContextType {
  color: Color
  setColor: (color: Color) => void
}

const ColorContext = createContext<ColorContextType | undefined>(undefined)

const colorMap = {
  default: {
    light: {
      primary: 'oklch(0.25 0.05 261.692)',
      primaryForeground: 'oklch(0.985 0.002 247.839)',
    },
    dark: {
      primary: 'oklch(0.44 0.07 262.1)',
      primaryForeground: 'oklch(0.985 0.002 247.839)',
    },
    name: 'Default',
    color: '#000000'
  },
  blue: {
    light: {
      primary: 'oklch(0.45 0.15 264.665)',
      primaryForeground: 'oklch(0.985 0.002 247.839)',
    },
    dark: {
      primary: 'oklch(0.45 0.15 264.665)',
      primaryForeground: 'oklch(0.985 0.002 247.839)',
    },
    name: 'Blue',
    color: '#3b82f6'
  },
  green: {
    light: {
      primary: 'oklch(0.45 0.15 142.665)',
      primaryForeground: 'oklch(0.985 0.002 142.839)',
    },
    dark: {
      primary: 'oklch(0.45 0.15 142.665)',
      primaryForeground: 'oklch(0.985 0.002 142.839)',
    },
    name: 'Green',
    color: '#10b981'
  },
  purple: {
    light: {
      primary: 'oklch(0.45 0.15 300.665)',
      primaryForeground: 'oklch(0.985 0.002 300.839)',
    },
    dark: {
      primary: 'oklch(0.45 0.15 300.665)',
      primaryForeground: 'oklch(0.985 0.002 300.839)',
    },
    name: 'Purple',
    color: '#8b5cf6'
  },
  red: {
    light: {
      primary: 'oklch(0.45 0.15 0.665)',
      primaryForeground: 'oklch(0.985 0.002 0.839)',
    },
    dark: {
      primary: 'oklch(0.45 0.15 0.665)',
      primaryForeground: 'oklch(0.985 0.002 0.839)',
    },
    name: 'Red',
    color: '#ef4444'
  },
  orange: {
    light: {
      primary: 'oklch(0.45 0.15 45.665)',
      primaryForeground: 'oklch(0.985 0.002 45.839)',
    },
    dark: {
      primary: 'oklch(0.45 0.15 45.665)',
      primaryForeground: 'oklch(0.985 0.002 45.839)',
    },
    name: 'Orange',
    color: '#f97316'
  },
  pink: {
    light: {
      primary: 'oklch(0.45 0.15 320.665)',
      primaryForeground: 'oklch(0.985 0.002 320.839)',
    },
    dark: {
      primary: 'oklch(0.45 0.15 320.665)',
      primaryForeground: 'oklch(0.985 0.002 320.839)',
    },
    name: 'Pink',
    color: '#ec4899'
  }
}

export const colorOptions = Object.entries(colorMap).map(([id, config]) => ({
  id: id as Color,
  name: config.name,
  color: config.color
}))

export function ColorProvider({ children }: { children: React.ReactNode }) {
  const [color, setColor] = useState<Color>(() => {
    const saved = localStorage.getItem('color')
    return (saved as Color) || 'default'
  })

  useEffect(() => {
    localStorage.setItem('color', color)
    
    const applyColors = () => {
      const root = document.documentElement
      const colorConfig = colorMap[color]
      const isDark = root.classList.contains('dark')
      const themeColors = isDark ? colorConfig.dark : colorConfig.light
      
      root.style.setProperty('--primary', themeColors.primary)
      root.style.setProperty('--primary-foreground', themeColors.primaryForeground)
    }

    applyColors()

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          applyColors()
        }
      })
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })

    return () => observer.disconnect()
  }, [color])

  return (
    <ColorContext.Provider value={{ color, setColor }}>
      {children}
    </ColorContext.Provider>
  )
}

export function useColor() {
  const context = useContext(ColorContext)
  if (context === undefined) {
    throw new Error('useColor must be used within a ColorProvider')
  }
  return context
}

export { colorMap }
