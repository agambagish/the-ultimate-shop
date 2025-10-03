import { Suspense } from "react";

import { CategoryHeader } from "@/modules/categories/ui/components/category-header";

import { ProductFilters } from "../components/product-filters";
import { ProductList, ProductListSkeleton } from "../components/product-list";

interface Props {
  category?: string;
}

export function ProductListView({ category }: Props) {
  return (
    // biome-ignore lint/correctness/useUniqueElementIds: _
    <div id="products">
      <CategoryHeader />
      <div className="mx-auto flex max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <ProductFilters />
        <div className="flex-1 space-y-6">
          <Suspense fallback={<ProductListSkeleton />}>
            <ProductList category={category} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
