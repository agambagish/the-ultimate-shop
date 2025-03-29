"use client";

import {
  HelpCircleIcon,
  LayoutDashboardIcon,
  PackageIcon,
  PackageOpenIcon,
  QrCodeIcon,
  SearchIcon,
  SettingsIcon,
  UsersIcon,
  WalletIcon,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavMain } from "@/features/dashboard/components/nav-main";
import { NavSecondary } from "@/features/dashboard/components/nav-secondary";
import { NavUser } from "@/features/dashboard/components/nav-user";

interface Props {
  storeName: string;
  storeId: string;
}

export function DashboardSidebar({
  storeName,
  storeId,
  ...props
}: React.ComponentProps<typeof Sidebar> & Props) {
  const data = {
    user: {
      name: "shadcn",
      email: "m@example.com",
      avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
      {
        title: "Dashboard",
        url: `/dashboard/${storeId}`,
        icon: LayoutDashboardIcon,
      },
      {
        title: "Products",
        url: `/dashboard/${storeId}/products`,
        icon: PackageIcon,
      },
      {
        title: "Orders",
        url: "#",
        icon: PackageOpenIcon,
      },
      {
        title: "Customers",
        url: "#",
        icon: UsersIcon,
      },
      {
        title: "Payments",
        url: "#",
        icon: WalletIcon,
      },
    ],
    navSecondary: [
      {
        title: "Settings",
        url: "#",
        icon: SettingsIcon,
      },
      {
        title: "Get Help",
        url: "#",
        icon: HelpCircleIcon,
      },
      {
        title: "Search",
        url: "#",
        icon: SearchIcon,
      },
    ],
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <QrCodeIcon className="size-5" />
                <span className="text-base font-semibold">{storeName}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
