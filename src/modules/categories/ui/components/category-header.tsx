import { Suspense } from "react";

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { SearchBar } from "@/modules/home/ui/components/search-bar";
import { getQueryClient, trpc } from "@/trpc/server";

import { CategoryBar } from "./category-bar";

interface Props {
  storeSubdomain?: string;
}

export function CategoryHeader({ storeSubdomain }: Props) {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.categories.getMany.queryOptions());

  return (
    <div className="border-border/40 border-b bg-background/80 shadow-sm backdrop-blur-md">
      <div
        className={cn(
          "mx-auto px-4 py-6 sm:px-6 lg:px-8",
          storeSubdomain ? "max-w-6xl" : "max-w-7xl",
        )}
      >
        <SearchBar />
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
