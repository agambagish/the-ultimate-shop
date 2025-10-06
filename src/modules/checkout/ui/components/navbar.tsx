"use client";

import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { generateStoreURL } from "@/lib/utils";

interface Props {
  subdomain: string;
}

export function Navbar({ subdomain }: Props) {
  return (
    <nav className="h-20 border-b bg-white font-medium">
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <p className="font-bold text-2xl">Checkout</p>
        <Link
          href={generateStoreURL(subdomain)}
          className={buttonVariants({ variant: "link" })}
        >
          Continue Shopping
        </Link>
      </div>
    </nav>
  );
}
