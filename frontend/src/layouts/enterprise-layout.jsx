import { useMemo } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { Building2Icon, LogOutIcon, SettingsIcon, UserIcon } from "lucide-react"

import { EnterpriseAppSidebar } from "@/components/enterprise/enterprise-sidebar.jsx"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { getEnterpriseById } from "@/services/enterpriseService.js"
import { useAuth } from "@/context/auth-context.jsx"
import { getEnterpriseInvitations } from "@/services/partnershipService.js"
import { NotificationBell } from "@/components/notification-bell.jsx"
import { usePortalTheme } from "@/hooks/use-portal-theme.js"
import { PortalThemeToggle } from "@/components/portal-theme-toggle"

function getInitials(name = "") {
  return (
    name
      .split(/\s/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "OR"
  )
}

export default function EnterpriseLayout() {
  usePortalTheme()
  const navigate = useNavigate()
  const { user, logout: authLogout } = useAuth()
  // A signed-in enterprise account is scoped to its own organization via the
  // enterpriseId from /api/auth/me.
  const authEnterpriseId = user?.enterpriseId ?? null

  const scopedQuery = useQuery({
    queryKey: ["enterprise", authEnterpriseId],
    queryFn: () => getEnterpriseById(authEnterpriseId),
    enabled: authEnterpriseId != null,
    staleTime: 60_000,
    retry: 1,
  })

  const enterprise = useMemo(() => {
    if (authEnterpriseId != null) {
      return scopedQuery.data ?? null
    }
    return null
  }, [authEnterpriseId, scopedQuery.data])

  const outletContext = useMemo(
    () => ({
      enterprise,
      enterpriseLoading: scopedQuery.isLoading,
      enterpriseError: scopedQuery.isError,
      refetchEnterprise: scopedQuery.refetch,
    }),
    [enterprise, scopedQuery.isLoading, scopedQuery.isError, scopedQuery.refetch]
  )

  const orgName = enterprise?.enterpriseName ?? "Organization"
  const invitationsQuery = useQuery({
    queryKey: ["enterprise-invitations", authEnterpriseId],
    queryFn: () => getEnterpriseInvitations(authEnterpriseId),
    enabled: authEnterpriseId != null,
    refetchInterval: 30_000,
    staleTime: 15_000,
    retry: 1,
  })
  const notifications = (Array.isArray(invitationsQuery.data) ? invitationsQuery.data : [])
    .map((invitation) => {
      const status = String(invitation.status ?? "PENDING").toUpperCase()
      const accepted = status === "ACCEPTED"
      const cancelled = status === "EXPIRED" || status === "REVOKED"
      return {
        id: `invitation-${invitation.invitationId}-${status}`,
        type: accepted ? "accepted" : cancelled ? "cancelled" : "invitation",
        title: accepted
          ? "Learner accepted invitation"
          : cancelled
            ? `Invitation ${status.toLowerCase()}`
            : "Certification invitation sent",
        description: `${invitation.email} · ${invitation.certificationTitle}`,
        createdAt: invitation.sentAt,
        href: "/enterprise/invitations",
      }
    })
    .sort((a, b) => new Date(b.createdAt ?? 0) - new Date(a.createdAt ?? 0))

  const logout = async () => {
    await authLogout()
    localStorage.removeItem("enterprise_id")
    localStorage.removeItem("organizationId")
    navigate("/login", { replace: true })
  }

  return (
    <SidebarProvider
      className="netacad-portal enterprise-portal"
      open={false}
      style={{ "--sidebar-width-icon": "3.25rem" }}
    >
      <EnterpriseAppSidebar collapsible="icon" className="border-r border-sidebar-border" />

      <SidebarInset>
        <header className="sticky top-0 z-40 h-16 shrink-0 border-b bg-white/95 shadow-sm backdrop-blur">
          <div className="mx-auto flex h-full w-full max-w-[1280px] items-center justify-between gap-5 px-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <SidebarTrigger className="-ml-1 md:hidden" />
            <Separator
              orientation="vertical"
              className="mr-2 hidden data-[orientation=vertical]:h-4 md:block"
            />
            <div className="flex min-w-0 items-center gap-2 text-sm text-muted-foreground">
              <Building2Icon className="size-4 shrink-0" aria-hidden="true" />
              <span className="truncate">{orgName}</span>
            </div>
          </div>

          <div className="flex min-w-0 items-center justify-end gap-2">
            <NotificationBell
              items={notifications}
              loading={invitationsQuery.isLoading}
              emptyMessage="Learner invitation updates will appear here."
            />

            <PortalThemeToggle />

           <DropdownMenu>
             <DropdownMenuTrigger asChild>
               <button
                 type="button"
                 className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring"
                 aria-label="Open account menu"
               >
                 <Avatar>
                   <AvatarFallback>{getInitials(orgName)}</AvatarFallback>
                 </Avatar>
               </button>
             </DropdownMenuTrigger>
             <DropdownMenuContent
               align="end"
               sideOffset={10}
               className="w-56 p-2"
             >
               <DropdownMenuLabel>
                 <span className="block truncate">{orgName}</span>
                 <span className="block truncate text-xs font-normal text-muted-foreground">
                   {user?.email || "Enterprise"}
                 </span>
               </DropdownMenuLabel>
               <DropdownMenuSeparator />
               <DropdownMenuItem onClick={() => navigate("/enterprise/organization")}>
                 <UserIcon />
                 Profile
               </DropdownMenuItem>
               <DropdownMenuItem onClick={() => navigate("/enterprise/settings")}>
                 <SettingsIcon />
                 Settings
               </DropdownMenuItem>
               <DropdownMenuSeparator />
               <DropdownMenuItem variant="destructive" onClick={logout}>
                 <LogOutIcon />
                 Log out
               </DropdownMenuItem>
             </DropdownMenuContent>
           </DropdownMenu>
          </div>
          </div>
        </header>

        <div className="mx-auto flex w-full max-w-[1280px] flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
          <Outlet context={outletContext} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
