import { Suspense } from "react";

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { Footer } from "@/modules/stores/ui/components/footer";
import { Navbar, NavbarSkeleton } from "@/modules/stores/ui/components/navbar";
import { getQueryClient, trpc } from "@/trpc/server";

interface Props extends React.PropsWithChildren {
  params: Promise<{ subdomain: string }>;
}

export default async function ({ children, params }: Props) {
  const { subdomain } = await params;

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.stores.getOne.queryOptions({
      subdomain,
    }),
  );

  return (
    <div className="flex min-h-screen flex-col">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<NavbarSkeleton />}>
          <Navbar subdomain={subdomain} />
        </Suspense>
      </HydrationBoundary>
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}
