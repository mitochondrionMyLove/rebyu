"use client"

import * as React from "react"
import { NavLink } from "react-router-dom"
import {
  AwardIcon,
  BarChart3Icon,
  BookOpenIcon,
  CircleUserRoundIcon,
  FolderOpenIcon,
  GraduationCapIcon,
  TerminalIcon,
  TrophyIcon,
    CalendarIcon,
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

const learnerNav = {
  main: {
    name: "Main",
    items: [
      {
        name: "Progress",
        url: "/learner/progress",
        icon: BarChart3Icon,
      },
      {
        name: "Study Plan",
        url: "/learner/plan",
        icon: CalendarIcon,
      },
      {
        name: "Learning",
        url: "/learner/learning",
        activeUrls: ["/learner/learning", "/learner/lessons"],
        icon: BookOpenIcon,
      },
      {
        name: "Certifications",
        url: "/learner/certifications",
        icon: GraduationCapIcon,
      },
      {
        name: "Challenges",
        url: "/learner/challenges",
        icon: TrophyIcon,
      },
    ],
  },
  pages: {
    name: "Pages",
    items: [
      {
        name: "Account",
        url: "/learner/account",
        icon: CircleUserRoundIcon,
      },
      {
        name: "Files",
        url: "/learner/files",
        icon: FolderOpenIcon,
      },
    ],
  },
}

export function LearnerAppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <NavLink to="/learner/progress">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <TerminalIcon className="size-4" />
                </div>

                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Rebyu</span>
                  <span className="truncate text-xs">Learner Portal</span>
                </div>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavProjects projects={learnerNav} />
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
                <span className="truncate text-xs">Keep learning</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
