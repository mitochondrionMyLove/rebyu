import { useMemo } from "react"
import { Outlet } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { Bell, Building2Icon } from "lucide-react"

import { EnterpriseAppSidebar } from "@/components/enterprise/enterprise-sidebar.jsx"
import DemoRoleSwitcher from "@/components/development/demo-role-switcher"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
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
import { getAllEnterprises } from "@/services/enterpriseService.js"

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
  // Preview mode has no signed-in organization account, so the portal scopes
  // itself to the first organization on record. Pages fall back to clean
  // empty/error states when the backend requires authentication.
  const enterprisesQuery = useQuery({
    queryKey: ["enterprises"],
    queryFn: getAllEnterprises,
    staleTime: 60_000,
    retry: 1,
  })

  const enterprise = useMemo(() => {
    const list = Array.isArray(enterprisesQuery.data)
      ? enterprisesQuery.data
      : []
    return list[0] ?? null
  }, [enterprisesQuery.data])

  const outletContext = useMemo(
    () => ({
      enterprise,
      enterpriseLoading: enterprisesQuery.isLoading,
      enterpriseError: enterprisesQuery.isError,
      refetchEnterprise: enterprisesQuery.refetch,
    }),
    [
      enterprise,
      enterprisesQuery.isLoading,
      enterprisesQuery.isError,
      enterprisesQuery.refetch,
    ]
  )

  const orgName = enterprise?.enterpriseName ?? "Organization"

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
            <DemoRoleSwitcher />
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

            <Avatar>
              <AvatarFallback>{getInitials(orgName)}</AvatarFallback>
            </Avatar>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 px-5 py-3">
          <Outlet context={outletContext} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
