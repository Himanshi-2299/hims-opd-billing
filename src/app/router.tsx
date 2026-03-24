import { createBrowserRouter } from "react-router-dom"
import { AppShell } from "./components/layouts/app-shell"
import { CustomerManagementPage } from "../pages/CustomerManagementPage"
import { AddFacilityPage } from "../pages/AddFacilityPage"
import { EditFacilityPage } from "../pages/EditFacilityPage"
import { EditUserPage } from "../pages/EditUserPage"
import FacilityUsersPage from "../pages/FacilityUsersPage"
import AddUserPage from "../pages/AddUserPage"
import DashboardPage from "../pages/DashboardPage"
import PatientsPage from "../pages/PatientsPage"
import HistoricalRecordPage from "../pages/HistoricalRecordPage"
import RegisterPatientPage from "../pages/RegisterPatientPage"
import BillingHistoryPage from "../pages/BillingHistoryPage"
import RoleRedirect from "../pages/RoleRedirect"
import { RouteErrorBoundary } from "./components/blocks/route-error-boundary"
import { ProtectedRoute } from "./ProtectedRoute"

export const router = createBrowserRouter([
  {
    element: <AppShell />,
    errorElement: <RouteErrorBoundary />,
    children: [
      { path: "/", element: <RoleRedirect /> },
      { path: "/dashboard", element: <ProtectedRoute allowedRoles={["frontdesk"]}><DashboardPage /></ProtectedRoute> },
      { path: "/patients", element: <ProtectedRoute allowedRoles={["frontdesk"]}><PatientsPage /></ProtectedRoute> },
      { path: "/historical-records", element: <ProtectedRoute allowedRoles={["frontdesk"]}><HistoricalRecordPage /></ProtectedRoute> },
      { path: "/billing-history", element: <ProtectedRoute allowedRoles={["superadmin", "admin"]}><BillingHistoryPage /></ProtectedRoute> },
      { path: "/register-patient", element: <ProtectedRoute allowedRoles={["frontdesk"]}><RegisterPatientPage /></ProtectedRoute> },
      { path: "/masters", element: <ProtectedRoute allowedRoles={["superadmin"]}><CustomerManagementPage /></ProtectedRoute> },
      { path: "/facilities/add", element: <ProtectedRoute allowedRoles={["superadmin"]}><AddFacilityPage /></ProtectedRoute> },
      { path: "/facilities/edit/:id", element: <ProtectedRoute allowedRoles={["superadmin"]}><EditFacilityPage /></ProtectedRoute> },
      { path: "/users/edit/:id", element: <ProtectedRoute allowedRoles={["superadmin"]}><EditUserPage /></ProtectedRoute> },
      { path: "/masters/facilities/:facilityId/users", element: <ProtectedRoute allowedRoles={["superadmin"]}><FacilityUsersPage /></ProtectedRoute> },
      { path: "/masters/facilities/:facilityId/users/add", element: <ProtectedRoute allowedRoles={["superadmin"]}><AddUserPage /></ProtectedRoute> },
      { path: "/masters/facilities/:facilityId/users/edit/:userId", element: <ProtectedRoute allowedRoles={["superadmin"]}><EditUserPage /></ProtectedRoute> },
    ],
  },
  {
    path: "*",
    element: <RoleRedirect />,
    errorElement: <RouteErrorBoundary />,
  },
])