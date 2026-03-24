import * as React from "react"
import { Link } from "react-router-dom"
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
import { ICON_STROKE_WIDTH } from "../../lib/constants"
import { User } from "lucide-react"
import { SIDEBAR_ITEMS } from "../../lib/sidebar-config"
import LogoIcon from "../../assets/Logo.svg?react"

interface GlobalSidebarProps {
  sidebarHeader?: React.ReactNode
  sidebarFooter?: React.ReactNode
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

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        {sidebarHeader || <SidebarHeaderContent />}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {SIDEBAR_ITEMS.map((item) => {
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
                        <Link to={item.href}>
                          <Icon strokeWidth={ICON_STROKE_WIDTH} />
                          <span>{label}</span>
                        </Link>
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
      </SidebarContent>

      <SidebarFooter>
        {sidebarFooter || (
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src="" alt="User" />
                    <AvatarFallback className="rounded-lg">
                      <User strokeWidth={ICON_STROKE_WIDTH} className="size-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">John Doe</span>
                    <span className="truncate text-xs">john@example.com</span>
                  </div>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
