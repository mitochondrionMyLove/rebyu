import { Navigate, Outlet } from "react-router-dom"

import { roleHomePath, useAuth } from "@/context/auth-context.jsx"

function ProtectedRoute({ allowedRoles }) {
  const { user, status } = useAuth()

  if (status === "loading") {
    return null
  }

  if (status !== "authenticated") {
    return <Navigate to="/login" replace />
  }

  const role = (user?.role ?? "LEARNER").toUpperCase()
  if (!allowedRoles.includes(role)) {
    return <Navigate to={roleHomePath(role)} replace />
  }

  return <Outlet />
}

export default ProtectedRoute
