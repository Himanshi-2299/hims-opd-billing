import * as React from "react"
import { useLocation } from "react-router-dom"
import { SafeLink } from "../ui/safe-link"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Separator } from "../ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { SidebarTrigger } from "../ui/sidebar"
import { Badge } from "../ui/badge"
import { ICON_STROKE_WIDTH } from "../../../lib/constants"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { ThemeToggle } from "../theme-toggle"
import { Bell, Search, Settings, User, LogOut } from "lucide-react"
import { generateBreadcrumbs, type BreadcrumbItem as BreadcrumbItemType } from "../../../lib/navigation"
import { useRole, UserRole } from "../../../contexts/RoleContext"

interface GlobalHeaderProps {
  breadcrumbs?: BreadcrumbItemType[]
  onLogout?: () => void
  userName?: string
  userEmail?: string
  userAvatar?: string
}

export function GlobalHeader({
  breadcrumbs,
  onLogout,
  userName = "John Doe",
  userEmail = "john@example.com",
  userAvatar,
}: GlobalHeaderProps) {
  const location = useLocation()
  const [hash, setHash] = React.useState(window.location.hash)
  const { currentRole } = useRole()

  const userNames: Record<UserRole, string> = {
    superadmin: "John Doe",
    frontdesk: "Misha Dobriyal",
  }

  const userEmails: Record<UserRole, string> = {
    superadmin: "john@example.com",
    frontdesk: "misha@example.com",
  }

  const displayName = userNames[currentRole]
  const displayEmail = userEmails[currentRole]

  // Listen for hash changes
  React.useEffect(() => {
    const handleHashChange = () => {
      setHash(window.location.hash)
    }
    
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  // Generate breadcrumbs from route if not provided
  const getBreadcrumbs = React.useMemo(() => {
    const generatedBreadcrumbs = generateBreadcrumbs(location.pathname, breadcrumbs)
    
    // Filter out "Masters" breadcrumb for frontdesk role
    if (currentRole === "frontdesk") {
      return generatedBreadcrumbs.filter(
        (crumb) => crumb.label.toLowerCase() !== "masters"
      )
    }
    
    return generatedBreadcrumbs
  }, [breadcrumbs, location.pathname, hash, currentRole])

  const handleLogout = () => {
    if (onLogout) {
      onLogout()
    } else {
      console.log("Logout clicked")
    }
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white dark:bg-background backdrop-blur supports-[backdrop-filter]:bg-white dark:supports-[backdrop-filter]:bg-background">
      <div className="w-full flex h-10 items-center gap-4 px-4">
        {/* Sidebar Toggle */}
        <SidebarTrigger className="-ml-1" />
        
        <Separator orientation="vertical" className="h-full" />

        {/* Left Side - Breadcrumbs */}
        <div className="flex items-center flex-1 min-w-0">
          <Breadcrumb>
            <BreadcrumbList>
              {getBreadcrumbs.map((item, index) => {
                const isLast = index === getBreadcrumbs.length - 1
                return [
                  <BreadcrumbItem key={`item-${index}`}>
                    {isLast || !item.href ? (
                      <BreadcrumbPage>{item.label}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <SafeLink to={item.href}>{item.label}</SafeLink>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>,
                  !isLast && <BreadcrumbSeparator key={`sep-${index}`} />,
                ]
              })}
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Right Side - Search Bar, Icons & User Menu */}
        <div className="flex items-center gap-2">
          {/* Search Bar */}
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" strokeWidth={ICON_STROKE_WIDTH} />
            <Input
              type="text"
              placeholder="Search..."
              className="pl-9 pr-12 h-8 border border-border"
              style={{ fontSize: "var(--text-sm)" }}
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">⌘</span>/
            </kbd>
          </div>

          <Separator orientation="vertical" className="h-full" />

          {/* Notification Icon with Badge */}
          <Button variant="ghost" size="icon" aria-label="Notifications" className="relative">
            <Bell strokeWidth={ICON_STROKE_WIDTH} className="size-4" />
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 size-4 flex items-center justify-center p-0 text-[10px] rounded-full"
            >
              1
            </Badge>
          </Button>

          <Separator orientation="vertical" className="h-full" />

          {/* Theme Toggle */}
          <ThemeToggle />

          <Separator orientation="vertical" className="h-full" />

          {/* Settings Icon */}
          <Button variant="ghost" size="icon" aria-label="Settings">
            <Settings strokeWidth={ICON_STROKE_WIDTH} className="size-4" />
          </Button>

          <Separator orientation="vertical" className="h-full" />

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 h-9 px-2">
                <span className="text-sm font-medium">
                  {displayName}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{displayName}</p>
                  <p className="text-xs text-muted-foreground">{displayEmail}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <SafeLink to="/profile" className="flex items-center gap-2">
                  <User strokeWidth={ICON_STROKE_WIDTH} className="size-4" />
                  <span>Profile</span>
                </SafeLink>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <SafeLink to="/settings" className="flex items-center gap-2">
                  <Settings strokeWidth={ICON_STROKE_WIDTH} className="size-4" />
                  <span>Settings</span>
                </SafeLink>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                <LogOut strokeWidth={ICON_STROKE_WIDTH} className="mr-2 size-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}