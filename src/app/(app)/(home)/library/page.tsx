import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { LibraryView } from "@/modules/library/ui/views/library-view";
import { DEFAULT_LIMIT } from "@/modules/products/lib/constants";
import { getQueryClient, trpc } from "@/trpc/server";

export default async function () {
  const queryClient = getQueryClient();
  await queryClient.prefetchInfiniteQuery(
    trpc.library.getMany.infiniteQueryOptions({
      limit: DEFAULT_LIMIT,
    }),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <LibraryView />
    </HydrationBoundary>
  );
}
