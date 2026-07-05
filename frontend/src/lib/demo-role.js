// Development-only role selection for previewing the app without authentication.
// The whole module is designed to be easy to delete once real auth is wired in:
// remove this file, the useDemoRole hook, and DemoRoleSwitcher, then point
// ProtectedRoute back at the authenticated user's role.

export const DEMO_ROLE_KEY = "rebyu_demo_role"

export const DEMO_ROLES = ["LEARNER", "ENTERPRISE", "ADMIN"]

export const DEMO_ROLE_HOME = {
  LEARNER: "/learner/progress",
  ENTERPRISE: "/enterprise/dashboard",
  ADMIN: "/admin/dashboard",
}

export const DEMO_ROLE_LABELS = {
  LEARNER: "Learner",
  ENTERPRISE: "Organization",
  ADMIN: "Administrator",
}

// Legacy key still read by learnerService.getCurrentLearnerIdentity and older
// components; kept in sync so existing pages keep working during preview.
const LEGACY_ROLE_KEY = "role"

export function getDemoRole() {
  const stored = localStorage.getItem(DEMO_ROLE_KEY)
  if (stored && DEMO_ROLES.includes(stored)) {
    return stored
  }
  return "LEARNER"
}

export function setDemoRole(role) {
  if (!DEMO_ROLES.includes(role)) {
    return getDemoRole()
  }
  localStorage.setItem(DEMO_ROLE_KEY, role)
  localStorage.setItem(LEGACY_ROLE_KEY, role.toLowerCase())
  return role
}

export function getDemoRoleHome(role = getDemoRole()) {
  return DEMO_ROLE_HOME[role] ?? DEMO_ROLE_HOME.LEARNER
}
