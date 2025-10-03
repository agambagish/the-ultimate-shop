import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { SearchParams } from "nuqs/server";

import { Hero } from "@/modules/home/ui/components/hero";
import { DEFAULT_LIMIT } from "@/modules/products/lib/constants";
import { loadProductFilters } from "@/modules/products/lib/search-params";
import { ProductListView } from "@/modules/products/ui/views/product-list-view";
import { getQueryClient, trpc } from "@/trpc/server";

interface Props {
  searchParams: Promise<SearchParams>;
}

export default async function Page({ searchParams }: Props) {
  const filters = await loadProductFilters(searchParams);

  const queryClient = getQueryClient();
  void queryClient.prefetchInfiniteQuery(
    trpc.products.getMany.infiniteQueryOptions({
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      tags: filters.tags,
      limit: DEFAULT_LIMIT,
    }),
  );

  return (
    <main className="min-h-screen">
      <Hero />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ProductListView />
      </HydrationBoundary>
    </main>
  );
}
