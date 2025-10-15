"use client";

import { useState } from "react";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AlignRight, LogOut, Package, Store, UserCircle2 } from "lucide-react";

import { Logo } from "@/components/logo";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "@/hooks/use-session";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";

import { NavSidebar } from "./nav-sidebar";

const navItems = [
  { slug: "products", label: "Products" },
  { slug: "pricing", label: "Pricing" },
  { slug: "about", label: "About" },
  { slug: "blog", label: "Blog" },
];

export function Navbar() {
  const activeSegment = useSelectedLayoutSegment();
  const { session } = useSession();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const logout = useMutation(
    trpc.auth.logout.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.auth.session.queryOptions());
      },
    }),
  );

  return (
    <>
      <nav className="flex h-20 items-center justify-between border-b px-4">
        <Logo className="w-[20rem]" />
        <div className="hidden items-center gap-4 lg:flex">
          {navItems.map((item) => (
            <NavItem
              key={item.slug}
              isActive={activeSegment === item.slug}
              {...item}
            />
          ))}
        </div>
        <div className="flex w-[14rem] items-center justify-end space-x-2">
          {session.isLoading ? (
            <Skeleton className="h-10 w-30" />
          ) : session.data?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="size-10">
                  <UserCircle2 className="size-6 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="flex flex-col">
                  <span className="font-medium text-sm leading-none">
                    {session.data.user.fullname}
                  </span>
                  <span className="text-muted-foreground text-xs leading-none">
                    {session.data.user.email}
                  </span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {session.data.user.tenants?.[0]?.id ? (
                  <DropdownMenuItem asChild>
                    <Link href="/admin">
                      <Package />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem asChild>
                    <Link href="/sell">
                      <Store />
                      Start Selling
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => logout.mutate()}>
                  <LogOut />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden space-x-2 lg:flex">
              <Link
                href="/login"
                prefetch
                className={buttonVariants({
                  variant: "outline",
                  size: "lg",
                })}
              >
                Login
              </Link>
              <Link
                href="/register"
                prefetch
                className={cn(buttonVariants({ size: "lg" }), "shiny-button")}
              >
                Register
              </Link>
            </div>
          )}
          <Button
            variant="ghost"
            className="flex size-10 lg:hidden"
            onClick={() => setIsSidebarOpen(true)}
          >
            <AlignRight />
          </Button>
        </div>
      </nav>
      <NavSidebar
        items={navItems}
        open={isSidebarOpen}
        onOpenChange={setIsSidebarOpen}
      />
    </>
  );
}

interface NavItemProps {
  slug: string;
  label: string;
  isActive?: boolean;
}

function NavItem({ slug, label, isActive }: NavItemProps) {
  return (
    <Link
      href={`/${slug}`}
      className={cn(
        buttonVariants({ variant: "link" }),
        isActive && "underline",
      )}
    >
      {label}
    </Link>
  );
}
