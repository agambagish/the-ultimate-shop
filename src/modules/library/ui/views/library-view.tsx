import { Suspense } from "react";

import {
  PurchasedProductList,
  PurchasedProductListSkeleton,
} from "../components/purchased-product-list";

export function LibraryView() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col">
        <h1 className="mb-2 font-bold text-3xl lg:text-4xl">Your Library</h1>
        <p className="text-lg text-muted-foreground lg:text-xl">
          Access and manage your purchased digital assets
        </p>
      </div>
      <Suspense fallback={<PurchasedProductListSkeleton />}>
        <PurchasedProductList />
      </Suspense>
    </div>
  );
}
