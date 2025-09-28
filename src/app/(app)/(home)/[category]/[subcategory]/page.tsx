import { Suspense } from "react";

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { CategoryHeader } from "@/modules/categories/ui/components/category-header";
import {
  ProductList,
  ProductListSkeleton,
} from "@/modules/products/ui/components/product-list";
import { getQueryClient, trpc } from "@/trpc/server";

interface Props {
  params: Promise<{
    category: string;
    subcategory: string;
  }>;
}

export default async function ({ params }: Props) {
  const { category, subcategory } = await params;

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.products.getMany.queryOptions({
      category: subcategory,
    }),
  );

  return (
    <main className="min-h-screen">
      <CategoryHeader />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<ProductListSkeleton />}>
          <ProductList category={subcategory} />
        </Suspense>
      </HydrationBoundary>
    </main>
  );
}
