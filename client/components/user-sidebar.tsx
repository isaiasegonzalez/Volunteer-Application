"use client";

import * as React from "react";
import { Bell, LayoutDashboard, Settings } from "lucide-react";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import VolaLogo from "@/components/icons/Vola Logo";

const data = {
  user: {
    name: "User",
    email: "user@vola.com",
    avatar: "/UserProfilePicture.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/user",
      icon: LayoutDashboard,
    },
    {
      title: "Notifications",
      url: "/user/notifications",
      icon: Bell,
    },
    {
      title: "Settings",
      url: "/user/edit",
      icon: Settings,
    },
  ],
};

function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: React.ElementType;
  }[];
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Navigation</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild>
              <a href={item.url}>
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

export function UserSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="flex items-center h-24 p-4">
        <VolaLogo />
        User Panel
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
