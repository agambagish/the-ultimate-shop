import { Suspense } from "react";

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import {
  ProductView,
  ProductViewSkeleton,
} from "@/modules/products/ui/views/product-view";
import { getQueryClient, trpc } from "@/trpc/server";

interface Props {
  params: Promise<{
    productId: string;
    subdomain: string;
  }>;
}

export default async function ({ params }: Props) {
  const { productId, subdomain } = await params;

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.products.getOne.queryOptions({
      productId,
    }),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<ProductViewSkeleton />}>
        <ProductView productId={productId} storeSubdomain={subdomain} />
      </Suspense>
    </HydrationBoundary>
  );
}
