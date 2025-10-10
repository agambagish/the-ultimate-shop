"use client";

import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { File, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DEFAULT_LIMIT } from "@/modules/products/lib/constants";
import { useTRPC } from "@/trpc/client";

import { ProductCard, ProductCardSkeleton } from "./product-card";

export function ProductList() {
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
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3">
        {data.pages
          .flatMap((page) => page.docs)
          .map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              title={product.title}
              imageUrl={product.image?.url}
              storeSubdomain={product.tenant.subdomain}
              storeAvatarUrl={product.tenant.avatar?.url}
              reviewRating={3}
              reviewCount={5}
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

export function ProductListSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: DEFAULT_LIMIT }).map((_, i) => (
        <ProductCardSkeleton key={i.toString()} />
      ))}
    </div>
  );
}
