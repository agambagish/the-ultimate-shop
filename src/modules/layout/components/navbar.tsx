"use client";

import Link from "next/link";
import { useState } from "react";

import { ShoppingBagIcon } from "lucide-react";

import { ModeToggle } from "@/components/mode-toggle";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

import { AuthButton } from "../components/auth-button";
import { NavbarSidebar } from "./navbar-sidebar";

const navigationItems = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "Products",
    href: "/products",
  },
  {
    title: "Vendors",
    href: "/vendors",
  },
  {
    title: "Pricing",
    href: "/pricing",
  },
  {
    title: "About",
    href: "/about",
  },
];

interface Props {
  isStoreOwner: boolean;
}

export function Navbar({ isStoreOwner }: Props) {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  return (
    <header className="bg-background fixed top-0 left-0 z-40 w-full border-b">
      <div className="relative mx-auto flex min-h-20 max-w-7xl flex-row items-center gap-4 px-4 lg:grid lg:grid-cols-3">
        <div className="hidden flex-row items-center justify-start gap-4 lg:flex">
          <NavigationMenu className="flex items-start justify-start">
            <NavigationMenuList className="flex flex-row justify-start gap-4">
              {navigationItems.map((item) => (
                <NavigationMenuItem key={item.title}>
                  <Link
                    href={item.href}
                    className={buttonVariants({ variant: "ghost" })}
                  >
                    {item.title}
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div className="flex lg:justify-center">
          <Link href="/" className="text-xl font-bold whitespace-nowrap">
            Shop Inc.
          </Link>
        </div>
        <div className="flex w-full justify-end gap-4">
          <Button variant="outline" size="icon">
            <ShoppingBagIcon />
          </Button>
          <ModeToggle />
          <div className="border-r" />
          <AuthButton />
          {!isStoreOwner && (
            <Link
              href="/onboarding"
              className={cn(buttonVariants(), "hidden lg:flex")}
            >
              Start Selling
            </Link>
          )}
        </div>
        <div className="flex w-12 shrink items-end justify-end lg:hidden">
          <NavbarSidebar
            items={navigationItems}
            open={isSidebarOpen}
            onOpenChange={setIsSidebarOpen}
            isStoreOwner={isStoreOwner}
          />
        </div>
      </div>
    </header>
  );
}
