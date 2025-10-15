import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { SearchParams } from "nuqs/server";

import { DEFAULT_LIMIT } from "@/modules/products/lib/constants";
import { loadProductFilters } from "@/modules/products/lib/search-params";
import { ProductListView } from "@/modules/products/ui/views/product-list-view";
import { getQueryClient, trpc } from "@/trpc/server";

interface Props {
  params: Promise<{ subcategory: string }>;
  searchParams: Promise<SearchParams>;
}

export default async function ({ params, searchParams }: Props) {
  const { subcategory } = await params;
  const filters = await loadProductFilters(searchParams);

  const queryClient = getQueryClient();
  void queryClient.prefetchInfiniteQuery(
    trpc.products.getMany.infiniteQueryOptions({
      category: subcategory,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      tags: filters.tags,
      limit: DEFAULT_LIMIT,
    }),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductListView category={subcategory} />
    </HydrationBoundary>
  );
}
