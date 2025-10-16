"use client";

import Link from "next/link";

import { Logo } from "@/components/logo";
import { buttonVariants } from "@/components/ui/button";
import { cn, generateStoreURL } from "@/lib/utils";

interface Props {
  subdomain: string;
}

export function Navbar({ subdomain }: Props) {
  return (
    <nav className="h-20 border-b bg-background">
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-baseline space-x-2">
          <div className="flex items-center">
            <Logo className="w-56" />
            <span className="-bottom-2 relative ml-3 font-bold text-[15px] text-primary tracking-tight">
              Checkout
            </span>
          </div>
        </div>
        <Link
          href={generateStoreURL(subdomain)}
          className={cn(buttonVariants({ variant: "link" }), "hidden md:flex")}
        >
          Continue Shopping
        </Link>
      </div>
    </nav>
  );
}
