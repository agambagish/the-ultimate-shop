"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { TextAlignEnd } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { useSession } from "@/hooks/use-session";
import { cn } from "@/lib/utils";

import { NavSidebar } from "./nav-sidebar";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/pricing", label: "Pricing" },
  { href: "/features", label: "Features" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
];

export function Navbar() {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const { session } = useSession();

  return (
    <nav className="flex h-20 justify-between border-b bg-white font-medium">
      <Link href="/" className="flex items-center pl-6">
        <span className="font-extrabold text-4xl">The Ultimate Shop</span>
      </Link>
      <NavSidebar
        items={navItems}
        open={isSidebarOpen}
        onOpenChange={setIsSidebarOpen}
      />
      <div className="hidden items-center gap-4 lg:flex">
        {navItems.map((item) => (
          <NavItem
            key={item.href}
            isActive={pathname === item.href}
            {...item}
          />
        ))}
      </div>
      {session.data?.user ? (
        <div className="hidden lg:flex">
          <Link
            href="/admin"
            className={cn(
              buttonVariants(),
              "h-full rounded-none border-t-0 border-r-0 border-b-0 border-l-0 bg-black px-12 text-lg text-white transition-colors hover:bg-secondary hover:text-black",
            )}
          >
            Dashboard
          </Link>
        </div>
      ) : (
        <div className="hidden lg:flex">
          <Link
            prefetch
            href="/login"
            className={cn(
              buttonVariants({ variant: "secondary" }),
              "h-full rounded-none border-t-0 border-r-0 border-b-0 border-l bg-secondary px-12 text-lg transition-colors hover:bg-white",
            )}
          >
            Log in
          </Link>
          <Link
            prefetch
            href="/register"
            className={cn(
              buttonVariants(),
              "h-full rounded-none border-t-0 border-r-0 border-b-0 border-l-0 bg-black px-12 text-lg text-white transition-colors hover:bg-secondary hover:text-black",
            )}
          >
            Start Selling
          </Link>
        </div>
      )}
      <div className="flex items-center justify-center lg:hidden">
        <Button
          variant="ghost"
          className="mr-2 size-12 border-transparent bg-white"
          onClick={() => setIsSidebarOpen(true)}
        >
          <TextAlignEnd className="size-5" />
        </Button>
      </div>
    </nav>
  );
}

interface NavItemProps {
  href: string;
  label: string;
  isActive?: boolean;
}

function NavItem({ href, label, isActive }: NavItemProps) {
  return (
    <Button
      asChild
      variant="outline"
      className={cn(
        "h-11 rounded-full border-transparent px-5 shadow-none transition-all hover:border-primary hover:bg-transparent",
        isActive && "bg-black text-white hover:bg-black hover:text-white",
      )}
    >
      <Link href={href}>{label}</Link>
    </Button>
  );
}
