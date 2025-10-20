import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { PurchasedProductView } from "@/modules/library/ui/views/purchased-product-view";
import { getQueryClient, trpc } from "@/trpc/server";

interface Props {
  params: Promise<{ orderId: string }>;
}

export default async function ({ params }: Props) {
  const { orderId } = await params;

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.library.getOne.queryOptions({
      orderId,
    }),
  );

  void queryClient.prefetchQuery(
    trpc.reviews.getOne.queryOptions({
      orderId,
    }),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PurchasedProductView orderId={orderId} />
    </HydrationBoundary>
  );
}
