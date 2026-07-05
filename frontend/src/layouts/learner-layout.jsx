import React, { useMemo, useState } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import {
  Bell,
  LogOutIcon,
  Search,
  SettingsIcon,
  UserIcon,
} from "lucide-react"

import { LearnerAppSidebar } from "@/components/learner/learner-sidebar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  LearnerErrorState,
  LearnerLoadingSkeleton,
  getLearnerDisplayName,
} from "@/components/learner/learner-ui.jsx"
import { getLearnerPortalData } from "@/services/learnerAnalyticsService.js"
import DemoRoleSwitcher from "@/components/development/demo-role-switcher"

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
  const navigate = useNavigate()
  const [searchValue, setSearchValue] = useState("")

  const query = useQuery({
    queryKey: ["learner-portal-data"],
    queryFn: getLearnerPortalData,
    staleTime: 30_000,
  })

  const displayName = getLearnerDisplayName(query.data)
  const email = query.data?.user?.email ?? query.data?.identity?.email ?? ""

  const outletContext = useMemo(
    () => ({
      data: query.data,
      searchValue,
      setSearchValue,
      refetch: query.refetch,
    }),
    [query.data, query.refetch, searchValue]
  )

  const logout = () => {
    localStorage.removeItem("role")
    localStorage.removeItem("learnerId")
    localStorage.removeItem("learner_id")
    localStorage.removeItem("userId")
    localStorage.removeItem("user_id")
    localStorage.removeItem("name")
    localStorage.removeItem("email")
    navigate("/", { replace: true })
  }

  return (
    <SidebarProvider>
      <LearnerAppSidebar />

      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />

            <label className="relative hidden w-[360px] max-w-[42vw] lg:block">
              <span className="sr-only">Search learner portal</span>
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder="Search lessons, certifications, files"
                className="h-9 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm shadow-xs outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              />
            </label>
          </div>

          <div className="flex items-center gap-2 px-4">
            <DemoRoleSwitcher />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open notifications">
                  <Bell />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" sideOffset={10} className="w-72 p-2">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="px-3 py-8 text-center">
                  <Bell className="mx-auto size-5 text-muted-foreground" />
                  <p className="mt-2 text-sm font-medium">No notifications yet</p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    Certification updates and reminders will appear here.
                  </p>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

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
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/learner/account")}>
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
        </header>

        <div className="flex flex-1 flex-col gap-4 px-5 py-3">
          {query.isLoading ? (
            <LearnerLoadingSkeleton />
          ) : query.isError ? (
            <LearnerErrorState error={query.error} onRetry={query.refetch} />
          ) : (
            <Outlet context={outletContext} />
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
