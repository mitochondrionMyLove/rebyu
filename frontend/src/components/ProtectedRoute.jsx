import { Navigate, Outlet } from "react-router-dom"

import { getDemoRole, getDemoRoleHome } from "@/lib/demo-role"
import { roleHomePath, useAuth } from "@/context/auth-context.jsx"

/**
 * Role guard.
 *
 * Signed in: the backend-confirmed role from /api/auth/me is the only
 * authority — localStorage is never trusted for access decisions.
 *
 * Signed out: in development the demo-role preview keeps working so the
 * portals can be browsed without an account; in production the user is sent
 * to the sign-in page.
 */
function ProtectedRoute({ allowedRoles }) {
  const { user, status } = useAuth()

  if (status === "loading") {
    return null
  }

  if (status === "authenticated") {
    const role = (user?.role ?? "LEARNER").toUpperCase()
    if (!allowedRoles.includes(role)) {
      return <Navigate to={roleHomePath(role)} replace />
    }
    return <Outlet />
  }

  if (import.meta.env.DEV) {
    const role = getDemoRole()
    if (!allowedRoles.includes(role)) {
      return <Navigate to={getDemoRoleHome(role)} replace />
    }
    return <Outlet />
  }

  return <Navigate to="/login" replace />
}

export default ProtectedRoute
