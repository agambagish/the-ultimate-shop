import { Suspense } from "react";

import { cn } from "@/lib/utils";

import { ProductFilters } from "../components/product-filters";
import { ProductList, ProductListSkeleton } from "../components/product-list";
import { ProductListHeader } from "../components/product-list-header";

interface Props {
  category?: string;
  storeSubdomain?: string;
}

export function ProductListView({ category, storeSubdomain }: Props) {
  return (
    <div className="bg-background">
      <ProductListHeader storeSubdomain={storeSubdomain} />
      <div
        className={cn(
          "mx-auto flex gap-8 px-4 py-8 sm:px-6 lg:px-8",
          storeSubdomain ? "max-w-6xl" : "max-w-7xl",
        )}
      >
        <ProductFilters />
        <div className="flex-1 space-y-6">
          <Suspense fallback={<ProductListSkeleton />}>
            <ProductList category={category} storeSubdomain={storeSubdomain} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
