/**
 * Navigation Utilities
 * 
 * Centralized navigation logic following the canonical guide's principle
 * of separating navigation concerns from UI components.
 */

export interface BreadcrumbItem {
  label: string
  href?: string
}

/**
 * Format a URL path segment into a human-readable label
 * 
 * @example
 * formatPathSegment("patient-details") // "Patient Details"
 * formatPathSegment("dashboard") // "Dashboard"
 */
export function formatPathSegment(segment: string): string {
  return segment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

/**
 * Generate breadcrumbs from a pathname
 * 
 * @param pathname - Current pathname (e.g., "/dashboard/settings")
 * @param customBreadcrumbs - Optional custom breadcrumbs to override auto-generation
 * @returns Array of breadcrumb items
 * 
 * @example
 * generateBreadcrumbs("/dashboard/settings")
 * // Returns: [
 * //   { label: "Home", href: "/" },
 * //   { label: "Dashboard", href: "/dashboard" },
 * //   { label: "Settings" }
 * // ]
 */
export function generateBreadcrumbs(
  pathname: string,
  customBreadcrumbs?: BreadcrumbItem[]
): BreadcrumbItem[] {
  if (customBreadcrumbs) {
    return customBreadcrumbs
  }

  // Special handling for edit facility route
  if (pathname.startsWith("/facilities/edit/")) {
    return [
      { label: "Masters", href: "/masters" },
      { label: "Facilities", href: "/masters" },
      { label: "Edit Facility" }
    ]
  }

  // Special handling for edit user route
  if (pathname.startsWith("/users/edit/")) {
    return [
      { label: "Masters", href: "/masters" },
      { label: "Users", href: "/masters" },
      { label: "Edit Users" }
    ]
  }

  // Special handling for facility users page
  if (pathname.match(/\/masters\/facilities\/\d+\/users$/)) {
    return [
      { label: "Masters", href: "/masters" },
      { label: "Users", href: "/masters" },
      { label: "User Management" }
    ]
  }

  // Special handling for add user page
  if (pathname.match(/\/masters\/facilities\/\d+\/users\/add$/)) {
    return [
      { label: "Masters", href: "/masters" },
      { label: "Users", href: "/masters" },
      { label: "Add New User" }
    ]
  }

  // Special handling for edit user page (facility context)
  if (pathname.match(/\/masters\/facilities\/\d+\/users\/edit\/\d+$/)) {
    return [
      { label: "Masters", href: "/masters" },
      { label: "Users", href: "/masters" },
      { label: "Edit User" }
    ]
  }

  // Special handling for masters page - check if there's a hash for tab
  if (pathname === "/masters" || pathname === "/") {
    const hash = window.location.hash.replace("#", "")
    if (hash) {
      const tabName = hash.charAt(0).toUpperCase() + hash.slice(1)
      return [
        { label: "Masters", href: "/masters" },
        { label: tabName }
      ]
    }
    // Default to just "Masters" when no hash
    return [{ label: "Masters" }]
  }

  // Special handling for collections page
  if (pathname === "/billing-history") {
    return [{ label: "Collections" }]
  }

  const pathSegments = pathname.split("/").filter(Boolean)
  const items: BreadcrumbItem[] = [
    { label: "Masters", href: "/" },
  ]

  if (pathSegments.length === 0) {
    return [{ label: "Masters" }]
  }

  let currentPath = ""
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`
    const isLast = index === pathSegments.length - 1
    // Custom label mapping
    const formatted =
      segment === "billing-history" ? "Collections" : formatPathSegment(segment)
    items.push({
      label: formatted,
      href: isLast ? undefined : currentPath,
    })
  })

  return items
}

/**
 * Check if a route is currently active
 * 
 * @param currentPath - Current pathname
 * @param targetPath - Target path to check
 * @param exact - If true, requires exact match. If false, matches prefix (default: false)
 * @returns True if the route is active
 * 
 * @example
 * isActiveRoute("/dashboard", "/dashboard") // true
 * isActiveRoute("/dashboard/settings", "/dashboard") // true (prefix match)
 * isActiveRoute("/dashboard/settings", "/dashboard", true) // false (exact match)
 */
export function isActiveRoute(
  currentPath: string,
  targetPath: string,
  exact: boolean = false
): boolean {
  if (exact) {
    return currentPath === targetPath
  }
  
  // Prefix match - useful for highlighting parent routes
  return currentPath === targetPath || currentPath.startsWith(`${targetPath}/`)
}

/**
 * Get a human-readable label for a route
 * 
 * @param pathname - Pathname to get label for
 * @returns Formatted label
 * 
 * @example
 * getRouteLabel("/dashboard") // "Dashboard"
 * getRouteLabel("/patient-details") // "Patient Details"
 */
export function getRouteLabel(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean)
  if (segments.length === 0) {
    return "Masters"
  }
  
  // Return the last segment formatted
  return formatPathSegment(segments[segments.length - 1])
}

/**
 * Safely build a path from segments
 * 
 * @param segments - Path segments to join
 * @returns Properly formatted path
 * 
 * @example
 * buildPath("dashboard", "settings") // "/dashboard/settings"
 * buildPath("/dashboard", "/settings") // "/dashboard/settings"
 * buildPath("dashboard/", "/settings") // "/dashboard/settings"
 */
export function buildPath(...segments: string[]): string {
  const normalized = segments
    .filter(Boolean)
    .map((segment) => segment.replace(/^\/+|\/+$/g, ""))
    .filter(Boolean)
    .join("/")
  
  return normalized ? `/${normalized}` : "/"
}