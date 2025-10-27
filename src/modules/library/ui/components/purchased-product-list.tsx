"use client";

import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { File, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DEFAULT_LIMIT } from "@/modules/products/lib/constants";
import { useTRPC } from "@/trpc/client";

import {
  PurchasedProductCard,
  PurchasedProductCardSkeleton,
} from "./purchased-product-card";

export function PurchasedProductList() {
  const trpc = useTRPC();
  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useSuspenseInfiniteQuery(
      trpc.library.getMany.infiniteQueryOptions(
        {
          limit: DEFAULT_LIMIT,
        },
        {
          getNextPageParam: (lastPage) =>
            lastPage.products.length > 0 ? lastPage.nextPage : undefined,
        },
      ),
    );

  if (data.pages?.[0]?.products.length === 0) {
    return (
      <div className="flex w-full flex-col items-center justify-center gap-y-4 rounded-2xl border border-border/40 bg-white/60 p-8 text-muted-foreground backdrop-blur-sm">
        <File />
        <p className="font-medium text-base">No products found</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {data.pages
          .flatMap((page) => page.products)
          .map((product) => (
            <PurchasedProductCard key={product.id} product={product} />
          ))}
      </div>
      <div className="flex justify-center pt-8">
        {hasNextPage && (
          <Button
            disabled={isFetchingNextPage}
            onClick={() => fetchNextPage()}
            variant="outline"
            className="themed-outline-btn cursor-pointer"
          >
            {isFetchingNextPage && <Loader2 className="animate-spin" />}
            Load more
          </Button>
        )}
      </div>
    </>
  );
}

export function PurchasedProductListSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: DEFAULT_LIMIT }).map((_, i) => (
        <PurchasedProductCardSkeleton key={i.toString()} />
      ))}
    </div>
  );
}
