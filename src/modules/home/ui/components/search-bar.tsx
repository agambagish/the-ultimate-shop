"use client";

import Link from "next/link";

import { Search } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function SearchBar() {
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 transform text-muted-foreground" />
        <div className="relative">
          <Input
            type="text"
            placeholder="Search for UI kits, templates, icons..."
            className="peer h-14 rounded-2xl border-border/40 bg-white/70 ps-10 pl-10 text-lg shadow-lg backdrop-blur-md transition-all focus:border-primary/60 focus:bg-white/90"
          />
          <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-4 text-muted-foreground/80 peer-disabled:opacity-50">
            <Search className="size-4" />
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-3">
        <Link
          href="/library"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-12 rounded-xl border-border/40 bg-white/60 px-6 backdrop-blur-sm transition-all hover:bg-white/80",
          )}
        >
          📚 Library
        </Link>
        <Link
          href="/products"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-12 rounded-xl border-border/40 bg-white/60 px-6 backdrop-blur-sm transition-all hover:bg-white/80",
          )}
        >
          🎯 View All
        </Link>
      </div>
    </div>
  );
}
