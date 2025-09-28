"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";

import { useProductFilters } from "../../hooks/use-product-filters";

interface Props {
  category?: string;
}

export function ProductList({ category }: Props) {
  const [filters] = useProductFilters();

  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.products.getMany.queryOptions({
      category,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      tags: filters.tags,
    }),
  );

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {data.docs.map((product) => (
        <div
          key={product.id}
          className="group rounded-2xl border border-border/40 bg-white/60 p-4 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:bg-white/80 hover:shadow-xl"
        >
          {product.title}
          <br />
          {product.price} Rs.
        </div>
      ))}
    </div>
  );
}

export function ProductListSkeleton() {
  return <div>Loading....</div>;
}
