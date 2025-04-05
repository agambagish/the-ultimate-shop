import type { Metadata } from "next";
import { Suspense } from "react";

import { DataTableSkeleton } from "@/features/data-table/components/data-table-skeleton";
import { productsTableParams } from "@/features/data-table/lib/products-table-params";
import { getValidFilters } from "@/features/data-table/lib/utils";
import { ProductsTable } from "@/features/product/components/products-table";
import {
  getCategories,
  getProductStatusCounts,
  getProducts,
} from "@/features/product/queries";

export const metadata: Metadata = {
  title: "Manage Products",
};

interface Props {
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
}

export default async function Page(props: Props) {
  const params = await props.searchParams;
  const searchParams = productsTableParams.parse(params);

  const validFilters = getValidFilters(searchParams.filters);

  const promises = Promise.all([
    getProducts({
      ...searchParams,
      filters: validFilters,
    }),
    getProductStatusCounts(),
  ]);

  return (
    <main className="p-8">
      <Suspense
        fallback={
          <DataTableSkeleton
            columnCount={7}
            filterCount={2}
            cellWidths={[
              "10rem",
              "30rem",
              "10rem",
              "10rem",
              "6rem",
              "6rem",
              "6rem",
            ]}
            shrinkZero
          />
        }
      >
        <ProductsTable
          promises={promises}
          categoriesPromise={getCategories()}
        />
      </Suspense>
    </main>
  );
}
