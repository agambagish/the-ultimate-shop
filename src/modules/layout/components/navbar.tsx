"use client";

import Link from "next/link";
import { useState } from "react";

import { ModeToggle } from "@/components/mode-toggle";
import { buttonVariants } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

import { AuthButton } from "./auth-button";
import { CartSheet } from "./cart-sheet";
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
  storeSlug?: string;
}

export function Navbar({ storeSlug }: Props) {
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
            The Ult. Shop
          </Link>
        </div>
        <div className="flex w-full justify-end gap-4">
          <CartSheet />
          <ModeToggle />
          <div className="border-r" />
          <AuthButton storeSlug={storeSlug} />
          {!storeSlug && (
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
            storeSlug={storeSlug}
          />
        </div>
      </div>
    </header>
  );
}
