"use client";

import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { File, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";
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
            lastPage.docs.length > 0 ? lastPage.nextPage : undefined,
        },
      ),
    );

  if (data.pages?.[0]?.docs.length === 0) {
    return (
      <div className="flex w-full flex-col items-center justify-center gap-y-4 rounded-2xl border border-border/40 bg-white/60 p-8 text-muted-foreground backdrop-blur-sm">
        <File />
        <p className="font-medium text-base">No products found</p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="h-[5.5rem] rounded-2xl border border-border/40 bg-background/60 p-4 backdrop-blur-sm">
          <p className="font-semibold text-muted-foreground text-xs uppercase tracking-wide">
            Total Spent
          </p>
          <p className="mt-2 font-bold text-2xl text-foreground">
            {formatCurrency(data.pages[0]?.totalSpent || 0)}
          </p>
        </div>
        <div className="h-[5.5rem] rounded-2xl border border-border/40 bg-background/60 p-4 backdrop-blur-sm">
          <p className="font-semibold text-muted-foreground text-xs uppercase tracking-wide">
            Items Owned
          </p>
          <p className="mt-2 font-bold text-2xl text-foreground">
            {data.pages.flatMap((page) => page.docs).length}
          </p>
        </div>
        <div className="h-[5.5rem] rounded-2xl border border-border/40 bg-background/60 p-4 backdrop-blur-sm">
          <p className="font-semibold text-muted-foreground text-xs uppercase tracking-wide">
            Avg. Price
          </p>
          <p className="mt-2 font-bold text-2xl text-foreground">
            {formatCurrency(
              (data.pages[0]?.totalSpent || 0) /
                data.pages.flatMap((page) => page.docs).length,
            )}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {data.pages
          .flatMap((page) => page.docs)
          .map((product) => (
            <PurchasedProductCard
              key={product.id}
              id={product.id}
              title={product.title}
              imageUrl={product.image?.url}
              storeName={product.tenant.name}
              storeAvatarUrl={product.tenant.avatar?.url}
            />
          ))}
      </div>
      <div className="flex justify-center pt-8">
        {hasNextPage && (
          <Button
            disabled={isFetchingNextPage}
            onClick={() => fetchNextPage()}
            variant="outline"
            className="cursor-pointer"
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
    <>
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Skeleton className="h-[5.5rem] w-full rounded-2xl" />
        <Skeleton className="h-[5.5rem] w-full rounded-2xl" />
        <Skeleton className="h-[5.5rem] w-full rounded-2xl" />
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: DEFAULT_LIMIT }).map((_, i) => (
          <PurchasedProductCardSkeleton key={i.toString()} />
        ))}
      </div>
    </>
  );
}
