import { Navigate, Outlet } from "react-router-dom"

function ProtectedRoute({ allowedRoles }) {
  const role = localStorage.getItem("role")

  if (!role) {
    return <Navigate to="/" replace />
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export default ProtectedRoute