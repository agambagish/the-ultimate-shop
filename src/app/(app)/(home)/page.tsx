import { Suspense } from "react";

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { Skeleton } from "@/components/ui/skeleton";
import { CategoryBar } from "@/modules/categories/ui/components/category-bar";
import { Hero } from "@/modules/home/ui/components/hero";
import { getQueryClient, trpc } from "@/trpc/server";

export default function Page() {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.categories.getMany.queryOptions());

  return (
    <main className="relative min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Hero />
        <HydrationBoundary state={dehydrate(queryClient)}>
          <Suspense
            fallback={<Skeleton className="h-11 w-full rounded-full" />}
          >
            <CategoryBar />
          </Suspense>
        </HydrationBoundary>
      </div>
    </main>
  );
}
