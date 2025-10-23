import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { SearchParams } from "nuqs/server";

import { DEFAULT_LIMIT } from "@/modules/products/lib/constants";
import { loadProductFilters } from "@/modules/products/lib/search-params";
import { ProductListView } from "@/modules/products/ui/views/product-list-view";
import { getQueryClient, trpc } from "@/trpc/server";

interface Props {
  searchParams: Promise<SearchParams>;
  params: Promise<{ subdomain: string }>;
}

export default async function ({ params, searchParams }: Props) {
  const { subdomain } = await params;
  const filters = await loadProductFilters(searchParams);

  const queryClient = getQueryClient();
  void queryClient.prefetchInfiniteQuery(
    trpc.products.getMany.infiniteQueryOptions({
      storeSubdomain: subdomain,
      limit: DEFAULT_LIMIT,
      ...filters,
    }),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductListView storeSubdomain={subdomain} />
    </HydrationBoundary>
  );
}
