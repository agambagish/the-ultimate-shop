"use client";

import Link from "next/link";

import { PackageOpen, Search } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function SearchBar() {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row">
      <div className="relative flex-1">
        <Input
          type="text"
          placeholder="Search for UI kits, templates, icons..."
          className="peer h-12 rounded-2xl border-border/40 bg-background/70 ps-10 pl-10 text-lg shadow-lg backdrop-blur-md transition-all focus:border-primary/60 focus:bg-background/90"
        />
        <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-4 text-muted-foreground/80 peer-disabled:opacity-50">
          <Search className="size-4" />
        </div>
      </div>
      <Link
        href="/library"
        prefetch
        className={cn(
          buttonVariants({ variant: "outline" }),
          "themed-outline-btn h-12 rounded-xl px-6",
        )}
      >
        <PackageOpen />
        Library
      </Link>
    </div>
  );
}
