import * as React from "react"
import {BookOpen, Home,Settings2,} from "lucide-react"

import { NavMain } from "~/components/common/dashboard/nav-main"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "~/components/ui/sidebar"


const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
      isActive: true,
    },
    {
      title: "Tasks",
      url: "/dashboard",
      icon: BookOpen,
      isActive: false,
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Manage Profile",
          url: "/account",
        },
        {
          title: "Manage Password",
          url: "/account/change-password",
        }
      ],
    },
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="border-b p-3 border-gray-100">
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">
              Welcome
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
