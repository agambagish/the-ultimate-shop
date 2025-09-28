import { Suspense } from "react";

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { SearchParams } from "nuqs/server";

import { CategoryHeader } from "@/modules/categories/ui/components/category-header";
import { loadProductFilters } from "@/modules/products/lib/search-params";
import { ProductFilters } from "@/modules/products/ui/components/product-filters";
import {
  ProductList,
  ProductListSkeleton,
} from "@/modules/products/ui/components/product-list";
import { getQueryClient, trpc } from "@/trpc/server";

interface Props {
  params: Promise<{ category: string }>;
  searchParams: Promise<SearchParams>;
}

export default async function ({ params, searchParams }: Props) {
  const { category } = await params;
  const filters = await loadProductFilters(searchParams);

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.products.getMany.queryOptions({
      category,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      tags: filters.tags,
    }),
  );

  return (
    <main className="min-h-screen">
      <CategoryHeader />
      <div className="mx-auto flex max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <ProductFilters />
        <div className="flex-1 space-y-6">
          <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={<ProductListSkeleton />}>
              <ProductList category={category} />
            </Suspense>
          </HydrationBoundary>
        </div>
      </div>
    </main>
  );
}
