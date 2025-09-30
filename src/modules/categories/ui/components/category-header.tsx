import { Suspense } from "react";
import Link from "next/link";

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Search } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { getQueryClient, trpc } from "@/trpc/server";

import { CategoryBar } from "./category-bar";

export function CategoryHeader() {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.categories.getMany.queryOptions());

  return (
    <div className="border-border/40 border-b bg-white/80 shadow-sm backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row">
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="Search for UI kits, templates, icons..."
              className="peer h-12 rounded-2xl border-border/40 bg-white/70 ps-10 pl-10 text-lg shadow-lg backdrop-blur-md transition-all focus:border-primary/60 focus:bg-white/90"
            />
            <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-4 text-muted-foreground/80 peer-disabled:opacity-50">
              <Search className="size-4" />
            </div>
          </div>
          <Link
            href="/library"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-12 rounded-xl border-border/40 bg-white/60 px-6 backdrop-blur-sm transition-all hover:bg-white/80",
            )}
          >
            📚 Library
          </Link>
        </div>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <Suspense
            fallback={<Skeleton className="h-11 w-full rounded-full" />}
          >
            <CategoryBar />
          </Suspense>
        </HydrationBoundary>
      </div>
    </div>
  );
}
