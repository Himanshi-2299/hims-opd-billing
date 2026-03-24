import { Outlet } from "react-router-dom"
import { SidebarProvider, SidebarInset } from "../ui/sidebar"
import { GlobalHeader } from "../blocks/global-header"
import { GlobalSidebar } from "../blocks/global-sidebar"
import { GlobalFooter } from "../blocks/global-footer"

interface AppShellProps {
  breadcrumbs?: Array<{ label: string; href?: string }>
  onLogout?: () => void
  userName?: string
  userEmail?: string
  userAvatar?: string
  sidebarHeader?: React.ReactNode
  sidebarFooter?: React.ReactNode
}

export function AppShell({
  breadcrumbs,
  onLogout,
  userName,
  userEmail,
  userAvatar,
  sidebarHeader,
  sidebarFooter,
}: AppShellProps) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <GlobalSidebar sidebarHeader={sidebarHeader} sidebarFooter={sidebarFooter} />

        <SidebarInset className="flex h-full flex-col overflow-hidden">
          <GlobalHeader
            breadcrumbs={breadcrumbs}
            onLogout={onLogout}
            userName={userName}
            userEmail={userEmail}
            userAvatar={userAvatar}
          />

          <main className="flex-1 overflow-auto">
            <Outlet />
          </main>

          <GlobalFooter />
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
