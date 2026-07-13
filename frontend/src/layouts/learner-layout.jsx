import React, { useMemo, useState } from "react"
import { Outlet, useLocation, useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import {
  LogOutIcon,
  Search,
  SettingsIcon,
  UserIcon,
} from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { LearnerAppSidebar } from "@/components/learner/learner-sidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  LearnerErrorState,
  LearnerLoadingSkeleton,
  getLearnerDisplayName,
} from "@/components/learner/learner-ui.jsx"
import { getLearnerPortalData } from "@/services/learnerAnalyticsService.js"
import { useAuth } from "@/context/auth-context.jsx"
import { NotificationBell } from "@/components/notification-bell.jsx"
import { getLearnerInvitations } from "@/services/enterpriseService.js"
import { usePortalTheme } from "@/hooks/use-portal-theme.js"
import { PortalThemeToggle } from "@/components/portal-theme-toggle"

function getInitials(name = "", email = "") {
  const source = name || email || "Learner"
  return source
    .split(/\s|@/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("")
}

export default function LearnerLayout() {
  usePortalTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const isChallengesPage = location.pathname === "/learner/challenges"
  const { logout: authLogout } = useAuth()
  const [searchValue, setSearchValue] = useState("")

  const query = useQuery({
    queryKey: ["learner-portal-data"],
    queryFn: getLearnerPortalData,
    staleTime: 30_000,
  })

  const displayName = getLearnerDisplayName(query.data)
  const email = query.data?.user?.email ?? query.data?.identity?.email ?? ""
  const invitationsQuery = useQuery({
    queryKey: ["learner-notification-invitations", email],
    queryFn: getLearnerInvitations,
    enabled: Boolean(email),
    refetchInterval: 30_000,
    staleTime: 15_000,
    retry: 1,
  })
  const certificationById = new Map(
    (query.data?.certifications ?? []).map((certification) => [
      String(certification.certificationId),
      certification,
    ])
  )
  const pendingInvitationNotifications = (
    Array.isArray(invitationsQuery.data) ? invitationsQuery.data : []
  )
    .filter(
      (invitation) =>
        String(invitation.email ?? "").toLowerCase() === email.toLowerCase() &&
        String(invitation.status ?? "").toUpperCase() === "PENDING"
    )
    .map((invitation) => ({
      id: `pending-certification-invitation-${invitation.invitationId}`,
      type: "invitation",
      title: "You have a certification invitation",
      description: "An organization invited you to join a certification. Open the invitation email to accept it.",
      createdAt: invitation.sentAt,
    }))

  const assignmentNotifications = (query.data?.enrollments ?? [])
    .filter((enrollment) => enrollment.source === "enterprise")
    .map((enrollment) => {
      const certification = certificationById.get(String(enrollment.certificationId))
      return {
        id: `enterprise-certification-${enrollment.certificationId}`,
        type: "certification",
        title: "New certification assigned",
        description: certification?.title ?? certification?.name ?? "Your organization assigned you a certification.",
        createdAt: enrollment.assignedAt,
        href: `/learner/certifications/${enrollment.certificationId}`,
      }
    })
  const notifications = [...pendingInvitationNotifications, ...assignmentNotifications]
    .sort((a, b) => new Date(b.createdAt ?? 0) - new Date(a.createdAt ?? 0))

  const outletContext = useMemo(
    () => ({
      data: query.data,
      searchValue,
      setSearchValue,
      refetch: query.refetch,
    }),
    [query.data, query.refetch, searchValue]
  )

  const logout = async () => {
    await authLogout()
    localStorage.removeItem("learner_id")
    localStorage.removeItem("userId")
    localStorage.removeItem("user_id")
    navigate("/login", { replace: true })
  }

  return (
    <SidebarProvider
      className="netacad-portal learner-portal"
      open={false}
      style={{ "--sidebar-width-icon": "3.25rem" }}
    >
      <LearnerAppSidebar collapsible="icon" className="border-r border-sidebar-border" />

      <SidebarInset className={isChallengesPage ? "!bg-[#eef4ff] dark:!bg-[#071126]" : undefined}>
      <header className="sticky top-0 z-40 h-16 border-b bg-white/95 shadow-sm backdrop-blur">
        <div className="mx-auto flex h-full w-full max-w-[1280px] items-center justify-between gap-5 px-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <SidebarTrigger className="md:hidden" aria-label="Open learner navigation" />

            <label className="relative hidden w-[320px] max-w-[48vw] sm:block lg:w-[380px]">
              <span className="sr-only">Search learner portal</span>
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder="Search lessons, certifications, and files"
                className="h-9 w-full rounded border border-input bg-white pl-9 pr-3 text-sm outline-none transition focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/15"
              />
            </label>
          </div>

          <div className="flex min-w-0 items-center justify-end gap-2">
            <NotificationBell
              items={notifications}
              loading={query.isLoading || invitationsQuery.isLoading}
              emptyMessage="Certification invitations and assignments will appear here."
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
                    <AvatarFallback>
                      {getInitials(displayName, email)}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                sideOffset={10}
                className="w-56 p-2"
              >
                <DropdownMenuLabel>
                  <span className="block truncate">{displayName}</span>
                  <span className="block truncate text-xs font-normal text-muted-foreground">
                    {email || "Learner"}
                  </span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/learner/account")}>
                  <UserIcon />
                  Account settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/learner/subscription")}>
                  <SettingsIcon />
                  Plan and billing
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

        <main className={`mx-auto flex w-full max-w-[1280px] flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 ${isChallengesPage ? "!bg-[#eef4ff] dark:!bg-[#071126]" : ""}`}>
          {query.isLoading ? (
            <LearnerLoadingSkeleton />
          ) : query.isError ? (
            <LearnerErrorState error={query.error} onRetry={query.refetch} />
          ) : (
            <Outlet context={outletContext} />
          )}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
