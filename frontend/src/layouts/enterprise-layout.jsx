import { useMemo } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { Bell, Building2Icon, LogOutIcon, SettingsIcon, UserIcon } from "lucide-react"

import { EnterpriseAppSidebar } from "@/components/enterprise/enterprise-sidebar.jsx"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
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

  const logout = async () => {
    await authLogout()
    localStorage.removeItem("enterprise_id")
    localStorage.removeItem("organizationId")
    navigate("/login", { replace: true })
  }

  return (
    <SidebarProvider>
      <EnterpriseAppSidebar />

      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <div className="flex min-w-0 items-center gap-2 text-sm text-muted-foreground">
              <Building2Icon className="size-4 shrink-0" aria-hidden="true" />
              <span className="truncate">{orgName}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 px-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Open notifications"
                >
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
                    Partnership and invitation updates will appear here.
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
        </header>

        <div className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
          <Outlet context={outletContext} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
