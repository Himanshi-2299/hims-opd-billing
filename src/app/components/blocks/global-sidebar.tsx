import * as React from "react"
import { SafeLink } from "../ui/safe-link"
import { useNavigate } from "react-router-dom"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "../ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { ICON_STROKE_WIDTH } from "../../../lib/constants"
import { User, ChevronDown } from "lucide-react"
import { SIDEBAR_ITEMS_BY_ROLE } from "../../../lib/sidebar-config"
import { useRole, UserRole } from "../../../contexts/RoleContext"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"

interface GlobalSidebarProps {
  sidebarHeader?: React.ReactNode
  sidebarFooter?: React.ReactNode
}

// Logo Component
function LogoIcon({ className }: { className?: string }) {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M3 27.2716L11.3008 32V22.5124V20.1429L3 15.3784V27.2716Z" fill="#4A4C60"/>
      <path d="M11.3192 13.0377L3 8.33915V13.0301L11.3008 17.7734L11.3192 13.0377Z" fill="#4A4C60"/>
      <path d="M17.5819 0L3 8.33915L11.3192 13.0377L17.5819 9.48669L25.8827 4.74334L17.5819 0Z" fill="#3AA9A0"/>
      <path d="M17.5819 18.9734L11.3008 22.5124V32L19.6762 27.2716L23.9192 29.6889L30.1767 26.0624L17.5819 18.9734Z" fill="#3AA9A0"/>
      <path d="M17.5819 18.9734L30.1767 26.0624V18.9734L25.8827 16.6017V4.74334L17.5819 9.48669V18.9734Z" fill="#2E8981"/>
    </svg>
  )
}

// Sidebar Header Content Component
function SidebarHeaderContent() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton 
          size="lg" 
          asChild
          className="!overflow-visible [&_svg]:!h-7 [&_svg]:!w-auto"
        >
          <div className="flex items-center h-7 gap-2 justify-start group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0">
            <LogoIcon className="h-7 w-auto shrink-0" />
            <span className="text-sm font-semibold whitespace-nowrap transition-[opacity,max-width] duration-200 ease-linear opacity-100 max-w-[200px] group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:max-w-0 group-data-[collapsible=icon]:overflow-hidden group-data-[collapsible=icon]:hidden">
              IQLine Inc
            </span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

export function GlobalSidebar({ sidebarHeader, sidebarFooter }: GlobalSidebarProps) {
  const { isMobile, setOpenMobile } = useSidebar()
  const { currentRole, setCurrentRole } = useRole()
  const navigate = useNavigate()

  const roleDisplayNames: Record<UserRole, string> = {
    superadmin: "Super Admin",
    admin: "Admin",
    frontdesk: "Front Desk",
  }

  const userNames: Record<UserRole, string> = {
    superadmin: "John Doe",
    admin: "Priya Admin",
    frontdesk: "Misha Dobriyal",
  }

  const handleRoleChange = (newRole: UserRole) => {
    setCurrentRole(newRole)
    // Navigate to appropriate default page for the role
    if (newRole === "superadmin") {
      navigate("/masters")
    } else if (newRole === "admin") {
      navigate("/billing-history")
    } else {
      navigate("/dashboard")
    }
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        {sidebarHeader || <SidebarHeaderContent />}
      </SidebarHeader>

      <SidebarContent>
        {currentRole === "frontdesk" ? (
          <>
            <SidebarGroup>
              <SidebarGroupLabel>Daily Operations</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {SIDEBAR_ITEMS_BY_ROLE[currentRole].map((item) => {
                      const Icon = item.icon
                      const label = item.label
                      return (
                        <SidebarMenuItem key={label}>
                          <SidebarMenuButton
                            asChild={!!item.href}
                            tooltip={label}
                            onClick={
                              item.href && isMobile
                                ? () => setOpenMobile(false)
                                : undefined
                            }
                          >
                            {item.href ? (
                              <SafeLink to={item.href}>
                                <Icon strokeWidth={ICON_STROKE_WIDTH} />
                                <span>{label}</span>
                              </SafeLink>
                            ) : (
                              <div>
                                <Icon strokeWidth={ICON_STROKE_WIDTH} />
                                <span>{label}</span>
                              </div>
                            )}
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      )
                    })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        ) : currentRole === "superadmin" ? (
          <>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {SIDEBAR_ITEMS_BY_ROLE[currentRole]
                    .filter((item) => !["Collections"].includes(item.label))
                    .map((item) => {
                      const Icon = item.icon
                      const label = item.label
                      return (
                        <SidebarMenuItem key={label}>
                          <SidebarMenuButton
                            asChild={!!item.href}
                            tooltip={label}
                            onClick={
                              item.href && isMobile
                                ? () => setOpenMobile(false)
                                : undefined
                            }
                          >
                            {item.href ? (
                              <SafeLink to={item.href}>
                                <Icon strokeWidth={ICON_STROKE_WIDTH} />
                                <span>{label}</span>
                              </SafeLink>
                            ) : (
                              <div>
                                <Icon strokeWidth={ICON_STROKE_WIDTH} />
                                <span>{label}</span>
                              </div>
                            )}
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      )
                    })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup>
              <SidebarGroupLabel>Management/Audit</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {SIDEBAR_ITEMS_BY_ROLE[currentRole]
                    .filter((item) => ["Collections"].includes(item.label))
                    .map((item) => {
                      const Icon = item.icon
                      const label = item.label
                      return (
                        <SidebarMenuItem key={label}>
                          <SidebarMenuButton
                            asChild={!!item.href}
                            tooltip={label}
                            onClick={
                              item.href && isMobile
                                ? () => setOpenMobile(false)
                                : undefined
                            }
                          >
                            {item.href ? (
                              <SafeLink to={item.href}>
                                <Icon strokeWidth={ICON_STROKE_WIDTH} />
                                <span>{label}</span>
                              </SafeLink>
                            ) : (
                              <div>
                                <Icon strokeWidth={ICON_STROKE_WIDTH} />
                                <span>{label}</span>
                              </div>
                            )}
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      )
                    })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        ) : currentRole === "admin" ? (
          <SidebarGroup>
            <SidebarGroupLabel>Management/Audit</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {SIDEBAR_ITEMS_BY_ROLE[currentRole].map((item) => {
                  const Icon = item.icon
                  const label = item.label
                  return (
                    <SidebarMenuItem key={label}>
                      <SidebarMenuButton
                        asChild={!!item.href}
                        tooltip={label}
                        onClick={
                          item.href && isMobile
                            ? () => setOpenMobile(false)
                            : undefined
                        }
                      >
                        {item.href ? (
                          <SafeLink to={item.href}>
                            <Icon strokeWidth={ICON_STROKE_WIDTH} />
                            <span>{label}</span>
                          </SafeLink>
                        ) : (
                          <div>
                            <Icon strokeWidth={ICON_STROKE_WIDTH} />
                            <span>{label}</span>
                          </div>
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ) : (
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {SIDEBAR_ITEMS_BY_ROLE[currentRole].map((item) => {
                  const Icon = item.icon
                  const label = item.label
                  return (
                    <SidebarMenuItem key={label}>
                      <SidebarMenuButton
                        asChild={!!item.href}
                        tooltip={label}
                        onClick={
                          item.href && isMobile
                            ? () => setOpenMobile(false)
                            : undefined
                        }
                      >
                        {item.href ? (
                          <SafeLink to={item.href}>
                            <Icon strokeWidth={ICON_STROKE_WIDTH} />
                            <span>{label}</span>
                          </SafeLink>
                        ) : (
                          <div>
                            <Icon strokeWidth={ICON_STROKE_WIDTH} />
                            <span>{label}</span>
                          </div>
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter>
        {sidebarFooter || (
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-md hover:bg-accent hover:text-accent-foreground data-[state=open]:bg-accent transition-colors"
                  >
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage src="" alt="User" />
                      <AvatarFallback className="rounded-lg">
                        <User strokeWidth={ICON_STROKE_WIDTH} className="size-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">{userNames[currentRole]}</span>
                      <span className="truncate text-xs text-muted-foreground">
                        {roleDisplayNames[currentRole]}
                      </span>
                    </div>
                    <ChevronDown className="ml-auto size-4 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="top"
                  align="end"
                  className="w-56 bg-background text-foreground"
                  sideOffset={4}
                >
                  <DropdownMenuLabel style={{ fontSize: "var(--text-sm)" }}>
                    Switch Role
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => handleRoleChange("superadmin")}
                    className={currentRole === "superadmin" ? "bg-accent" : ""}
                    style={{ fontSize: "var(--text-base)" }}
                  >
                    Super Admin
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleRoleChange("frontdesk")}
                    className={currentRole === "frontdesk" ? "bg-accent" : ""}
                    style={{ fontSize: "var(--text-base)" }}
                  >
                    Front Desk
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleRoleChange("admin")}
                    className={currentRole === "admin" ? "bg-accent" : ""}
                    style={{ fontSize: "var(--text-base)" }}
                  >
                    Admin
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}