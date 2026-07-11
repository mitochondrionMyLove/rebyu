import * as React from "react"
import { NavLink } from "react-router-dom"
import {
  AwardIcon,
  BarChart3Icon,
  BookOpenCheckIcon,
  BrainCircuitIcon,
  CalendarDaysIcon,
  CircleAlertIcon,
  CrownIcon,
  FilesIcon,
  FlameIcon,
  MessagesSquareIcon,
  SwordsIcon,
  UserRoundCogIcon,
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
    name: "Learning",
    items: [
      {
        name: "Progress",
        url: "/learner/progress",
        icon: BarChart3Icon,
      },
      {
        name: "Study Plan",
        url: "/learner/plan",
        icon: CalendarDaysIcon,
      },
      {
        name: "Certifications",
        url: "/learner/certifications",
        icon: AwardIcon,
      },
      {
        name: "My Learning",
        url: "/learner/learning",
        activeUrls: [
          "/learner/learning",
          "/learner/lessons",
        ],
        icon: BookOpenCheckIcon,
      },
      {
        name: "Challenges",
        url: "/learner/challenges",
        activeUrls: [
          "/learner/challenges",
          "/challenges",
        ],
        icon: SwordsIcon,
      },
    ],
  },

  pages: {
    name: "Resources",
    items: [
      {
        name: "Subscription",
        url: "/learner/subscription",
        icon: CrownIcon,
      },
      {
        name: "Account",
        url: "/learner/account",
        icon: UserRoundCogIcon,
      },
      {
        name: "Library",
        url: "/learner/library",
        icon: FilesIcon,
      },
      {
        name: "Mistakes Bank",
        url: "/learner/mistakes",
        icon: CircleAlertIcon,
      },
      {
        name: "Community Q&A",
        url: "/learner/community",
        activeUrls: [
          "/learner/community",
          "/learner/community/questions",
          "/learner/community/posts",
        ],
        icon: MessagesSquareIcon,
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
                    <BrainCircuitIcon className="size-4" />
                  </div>

                  <div className="grid min-w-0 flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    REBYU
                  </span>

                    <span className="truncate text-xs text-sidebar-foreground/60">
                    Learner Portal
                  </span>
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
              <SidebarMenuButton
                  size="lg"
                  className="cursor-default"
                  tooltip="Keep your learning streak active"
              >
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400">
                  <FlameIcon className="size-4" />
                </div>

                <div className="grid min-w-0 flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  Keep learning
                </span>

                  <span className="truncate text-xs text-sidebar-foreground/60">
                  Build your daily streak
                </span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
  )
}