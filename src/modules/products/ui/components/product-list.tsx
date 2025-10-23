"use client";

import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { File, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";

import { useProductFilters } from "../../hooks/use-product-filters";
import { DEFAULT_LIMIT } from "../../lib/constants";
import { ProductCard, ProductCardSkeleton } from "./product-card";

interface Props {
  category?: string;
  storeSubdomain?: string;
}

export function ProductList({ category, storeSubdomain }: Props) {
  const [filters] = useProductFilters();

  const trpc = useTRPC();
  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useSuspenseInfiniteQuery(
      trpc.products.getMany.infiniteQueryOptions(
        {
          category,
          storeSubdomain,
          limit: DEFAULT_LIMIT,
          ...filters,
        },
        {
          getNextPageParam: (lastPage) =>
            lastPage.products.length > 0 ? lastPage.nextPage : undefined,
        },
      ),
    );

  if (data.pages?.[0]?.products.length === 0) {
    return (
      <div className="flex w-full flex-col items-center justify-center gap-y-4 rounded-2xl border border-border/40 bg-background/60 p-8 text-muted-foreground backdrop-blur-sm">
        <File />
        <p className="font-medium text-base">No products found</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3">
        {data.pages
          .flatMap((page) => page.products)
          .map((product) => (
            <ProductCard key={product.id} product={product} />
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

export function ProductListSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: DEFAULT_LIMIT }).map((_, i) => (
        <ProductCardSkeleton key={i.toString()} />
      ))}
    </div>
  );
}
