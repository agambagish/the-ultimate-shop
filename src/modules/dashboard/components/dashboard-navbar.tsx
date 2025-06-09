"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

import { UserButton } from "@clerk/nextjs";
import { StoreIcon } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function DashboardNavbar() {
  const pathname = usePathname();
  const params = useParams<{ slug: string }>();

  const routes = [
    {
      href: `/dashboard/${params.slug}`,
      label: "Overview",
      isActive: pathname === `/dashboard/${params.slug}`,
    },
    {
      href: `/dashboard/${params.slug}/products`,
      label: "Products",
      isActive: pathname === `/dashboard/${params.slug}/products`,
    },
    {
      href: `/dashboard/${params.slug}/orders`,
      label: "Orders",
      isActive: pathname === `/dashboard/${params.slug}/orders`,
    },
    {
      href: `/dashboard/${params.slug}/customers`,
      label: "Customers",
      isActive: pathname === `/dashboard/${params.slug}/customers`,
    },
    {
      href: `/dashboard/${params.slug}/settings`,
      label: "Settings",
      isActive: pathname === `/dashboard/${params.slug}/settings`,
    },
  ];

  return (
    <header className="border-b">
      <div className="mx-auto flex h-16 max-w-7xl items-center px-4 lg:px-0">
        <Link
          href={`/dashboard/${params.slug}`}
          className={buttonVariants({ variant: "ghost" })}
        >
          <StoreIcon />
          Lucide Shop
        </Link>
        <nav className="mx-6 flex items-center space-x-4 lg:space-x-6">
          {routes.map((route, i) => (
            <Link
              key={i}
              href={route.href}
              className={cn(
                "hover:text-primary text-sm font-medium transition-colors",
                route.isActive
                  ? "text-black dark:text-white"
                  : "text-muted-foreground"
              )}
            >
              {route.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center space-x-4">
          <UserButton />
        </div>
      </div>
    </header>
  );
}
