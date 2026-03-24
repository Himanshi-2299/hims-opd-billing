"use client";

import * as React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useRole } from "../contexts/RoleContext";

type ProtectedRouteProps = {
  allowedRoles: Array<"superadmin" | "frontdesk" | "admin">;
  children: React.ReactNode;
};

export function ProtectedRoute({ allowedRoles, children }: ProtectedRouteProps) {
  const { currentRole } = useRole();
  const location = useLocation();

  if (!allowedRoles.includes(currentRole)) {
    const fallback =
      currentRole === "superadmin" ? "/masters" : currentRole === "admin" ? "/billing-history" : "/dashboard";
    return <Navigate to={fallback} state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

