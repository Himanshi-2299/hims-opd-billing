import * as React from "react"
import { cn } from "../../lib/utils"

interface PageHeaderProps {
  title: string
  leading?: React.ReactNode
  actions?: React.ReactNode
  noBorder?: boolean
}

export function PageHeader({ title, leading, actions, noBorder }: PageHeaderProps) {
  const [isScrolled, setIsScrolled] = React.useState(false)
  const headerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const headerElement = headerRef.current
    if (!headerElement) return

    // Find the scroll container (next sibling with overflow-auto)
    const scrollContainer = headerElement.nextElementSibling as HTMLElement
    
    if (!scrollContainer) return

    const handleScroll = () => {
      setIsScrolled(scrollContainer.scrollTop > 0)
    }

    scrollContainer.addEventListener("scroll", handleScroll, { passive: true })
    // Check initial state
    handleScroll()

    return () => {
      scrollContainer.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <div
      ref={headerRef}
      className={cn(
        "sticky top-0 z-30 flex h-14 items-center justify-between bg-background px-6 transition-all",
        isScrolled && !noBorder && "border-b"
      )}
    >
      <div className="flex items-center gap-2">
        {leading}
        <h1 className="text-lg font-semibold">{title}</h1>
      </div>
      {actions && (
        <div className="flex items-center gap-2 shrink-0">
          {actions}
        </div>
      )}
    </div>
  )
}
