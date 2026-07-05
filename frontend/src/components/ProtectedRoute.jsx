import { Navigate, Outlet } from "react-router-dom"

import { getDemoRole, getDemoRoleHome } from "@/lib/demo-role"

// Preview-mode route guard: routes render only for the selected demo role.
// Entering another role's route redirects to the selected role's dashboard.
function ProtectedRoute({ allowedRoles }) {
  const role = getDemoRole()

  if (!allowedRoles.includes(role)) {
    return <Navigate to={getDemoRoleHome(role)} replace />
  }

  return <Outlet />
}

export default ProtectedRoute
