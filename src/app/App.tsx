import { RouterProvider } from "react-router-dom"
import { ErrorBoundary } from "./components/blocks/error-boundary"
import { router } from "./router"
import { FacilitiesProvider } from "../contexts/FacilitiesContext"
import { UsersProvider } from "../contexts/UsersContext"
import { RoleProvider } from "../contexts/RoleContext"

export function App() {
  return (
    <ErrorBoundary>
      <RoleProvider>
        <FacilitiesProvider>
          <UsersProvider>
            <RouterProvider router={router} />
          </UsersProvider>
        </FacilitiesProvider>
      </RoleProvider>
    </ErrorBoundary>
  )
}

export default App