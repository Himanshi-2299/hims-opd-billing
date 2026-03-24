import { Users, UserCog, LayoutDashboard, UserPlus, FolderClock, Receipt } from "lucide-react"

export type UserRole = "superadmin" | "frontdesk" | "admin";

export const SIDEBAR_ITEMS_BY_ROLE: Record<UserRole, Array<{
  label: string;
  icon: typeof UserCog;
  href: string;
}>> = {
  superadmin: [
    {
      label: "Masters",
      icon: UserCog,
      href: "/masters",
    },
    {
      label: "Collections",
      icon: Receipt,
      href: "/billing-history",
    },
  ],
  admin: [
    {
      label: "Collections",
      icon: Receipt,
      href: "/billing-history",
    },
  ],
  frontdesk: [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
    },
    {
      label: "Patients",
      icon: Users,
      href: "/patients",
    },
    {
      label: "Historical Records",
      icon: FolderClock,
      href: "/historical-records",
    },
    {
      label: "Register Patient",
      icon: UserPlus,
      href: "/register-patient",
    },
  ],
};

// Default sidebar items (for backward compatibility)
export const SIDEBAR_ITEMS = SIDEBAR_ITEMS_BY_ROLE.frontdesk;