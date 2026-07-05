import { NavLink } from "react-router-dom"
import {
  AwardIcon,
  BarChart3Icon,
  Building2Icon,
  FolderOpenIcon,
  GraduationCapIcon,
  HandshakeIcon,
  LayoutDashboardIcon,
  MailPlusIcon,
  ReceiptTextIcon,
  SettingsIcon,
  TerminalIcon,
  UsersIcon,
} from "lucide-react"

import { NavProjects } from "@/components/nav-projects"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const enterpriseNav = {
  main: {
    name: "Main",
    items: [
      {
        name: "Dashboard",
        url: "/enterprise/dashboard",
        icon: LayoutDashboardIcon,
      },
      {
        name: "Learners",
        url: "/enterprise/learners",
        activeUrls: ["/enterprise/learners"],
        icon: UsersIcon,
      },
      {
        name: "Invitations",
        url: "/enterprise/invitations",
        icon: MailPlusIcon,
      },
      {
        name: "Certifications",
        url: "/enterprise/certifications",
        icon: GraduationCapIcon,
      },
      {
        name: "Analytics",
        url: "/enterprise/analytics",
        icon: BarChart3Icon,
      },
    ],
  },
  management: {
    name: "Management",
    items: [
      {
        name: "Partnership",
        url: "/enterprise/partnership",
        icon: HandshakeIcon,
      },
      {
        name: "Billing",
        url: "/enterprise/billing",
        icon: ReceiptTextIcon,
      },
      {
        name: "Files",
        url: "/enterprise/files",
        icon: FolderOpenIcon,
      },
      {
        name: "Organization",
        url: "/enterprise/organization",
        icon: Building2Icon,
      },
      {
        name: "Settings",
        url: "/enterprise/settings",
        icon: SettingsIcon,
      },
    ],
  },
}

export function EnterpriseAppSidebar(props) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <NavLink to="/enterprise/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <TerminalIcon className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Rebyu</span>
                  <span className="truncate text-xs">Organization Portal</span>
                </div>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavProjects projects={enterpriseNav} />
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-accent text-sidebar-accent-foreground">
                <AwardIcon className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">REBYU</span>
                <span className="truncate text-xs">Empowering teams</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
