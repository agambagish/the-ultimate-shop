import { Suspense } from "react";

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { Skeleton } from "@/components/ui/skeleton";
import { CategoryBar } from "@/modules/categories/ui/components/category-bar";
import { SearchBar } from "@/modules/home/ui/components/search-bar";
import { getQueryClient, trpc } from "@/trpc/server";

export function ProductListHeader() {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.categories.getMany.queryOptions());

  return (
    <div className="border-border/40 border-b bg-background/80 shadow-sm backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
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
