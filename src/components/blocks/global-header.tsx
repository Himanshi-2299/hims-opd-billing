import * as React from "react"
import { Link, useLocation } from "react-router-dom"
import { Button } from "../ui/button"
import { Separator } from "../ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { ICON_STROKE_WIDTH } from "../../lib/constants"
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
import { Bell, Settings, User, LogOut } from "lucide-react"
import { generateBreadcrumbs, type BreadcrumbItem as BreadcrumbItemType } from "../../lib/navigation"

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

  // Generate breadcrumbs from route if not provided
  const getBreadcrumbs = React.useMemo(() => {
    return generateBreadcrumbs(location.pathname, breadcrumbs)
  }, [breadcrumbs, location.pathname])

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
        {/* Left Side - Breadcrumbs */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <Breadcrumb className="hidden md:flex">
            <BreadcrumbList>
              {getBreadcrumbs.map((item, index) => {
                const isLast = index === getBreadcrumbs.length - 1
                return (
                  <React.Fragment key={index}>
                    <BreadcrumbItem>
                      {isLast || !item.href ? (
                        <BreadcrumbPage>{item.label}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink asChild>
                          <Link to={item.href}>{item.label}</Link>
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                    {!isLast && <BreadcrumbSeparator />}
                  </React.Fragment>
                )
              })}
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Right Side - Icons & User Menu */}
        <div className="flex items-center gap-2">
          {/* Notification Icon */}
          <Button variant="ghost" size="icon" aria-label="Notifications">
            <Bell strokeWidth={ICON_STROKE_WIDTH} className="size-4" />
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
                <Avatar className="size-7">
                  <AvatarImage src={userAvatar} alt={userName} />
                  <AvatarFallback>
                    <User strokeWidth={ICON_STROKE_WIDTH} className="size-4" />
                  </AvatarFallback>
                </Avatar>
                <span className="hidden md:inline-block text-sm font-medium max-w-[120px] truncate">
                  {userName}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{userName}</p>
                  <p className="text-xs text-muted-foreground">{userEmail}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile" className="flex items-center gap-2">
                  <User strokeWidth={ICON_STROKE_WIDTH} className="size-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings" className="flex items-center gap-2">
                  <Settings strokeWidth={ICON_STROKE_WIDTH} className="size-4" />
                  <span>Settings</span>
                </Link>
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
