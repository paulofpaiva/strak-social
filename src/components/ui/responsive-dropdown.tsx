import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Drawer, DrawerContent, DrawerFooter, DrawerTrigger, DrawerClose, DrawerTitle, DrawerDescription } from "@/components/ui/drawer"
import { VisuallyHidden } from "@/components/ui/visually-hidden"
import { useIsMobile } from "@/hooks/useIsMobile"
import { useState, useEffect } from "react"

interface ResponsiveDropdownItem {
  label: string
  icon?: React.ReactNode
  onClick: () => void
  variant?: 'default' | 'destructive'
  disabled?: boolean
}

interface ResponsiveDropdownProps {
  trigger: React.ReactNode
  items: ResponsiveDropdownItem[]
  align?: 'start' | 'center' | 'end'
}

export function ResponsiveDropdown({
  trigger,
  items,
  align = "end"
}: ResponsiveDropdownProps) {
  const isMobile = useIsMobile()
  const [isOpen, setIsOpen] = useState(false)

  const handleItemClick = (onClick: () => void, e?: React.MouseEvent) => {
    e?.stopPropagation()
    onClick()
    setIsOpen(false)
  }

  useEffect(() => {
    if (isOpen && isMobile) {
      const activeElement = document.activeElement as HTMLElement
      if (activeElement && activeElement.blur) {
        activeElement.blur()
      }
    }
  }, [isOpen, isMobile])

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger asChild onClick={(e) => e.stopPropagation()}>
          {trigger}
        </DrawerTrigger>
        <DrawerContent 
          className="border-0 max-h-[80vh] flex flex-col z-[150]"
          onPointerDownOutside={() => setIsOpen(false)}
        >
            <VisuallyHidden>
              <DrawerTitle>Options</DrawerTitle>
              <DrawerDescription>Select an action from the menu</DrawerDescription>
            </VisuallyHidden>
            <div className="flex-1 p-6 space-y-3 overflow-y-auto">
              {items.map((item, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className={`w-full justify-start h-16 text-lg font-normal px-6 rounded-xl ${
                    item.variant === 'destructive' 
                      ? 'text-destructive hover:text-destructive hover:bg-destructive/10' 
                      : 'text-foreground hover:bg-accent'
                  }`}
                  onClick={(e) => handleItemClick(item.onClick, e)}
                  disabled={item.disabled}
                >
                  {item.icon && (
                    <span className="mr-5 text-xl">
                      {item.icon}
                    </span>
                  )}
                  {item.label}
                </Button>
              ))}
            </div>
            
            <DrawerFooter className="p-6 bg-background">
              <DrawerClose asChild>
                <Button
                  variant="outline"
                  className="w-full h-14 text-lg rounded-full"
                  onClick={(e) => e.stopPropagation()}
                >
                  Cancel
                </Button>
              </DrawerClose>
            </DrawerFooter>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          {trigger}
        </DropdownMenuTrigger>
      <DropdownMenuContent align={align}>
        {items.map((item, index) => (
          <DropdownMenuItem
            key={index}
            onClick={(e) => handleItemClick(item.onClick, e)}
            className={item.variant === 'destructive' ? 'text-destructive focus:text-destructive' : ''}
            disabled={item.disabled}
          >
            {item.icon && (
              <span className="mr-2">
                {item.icon}
              </span>
            )}
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
