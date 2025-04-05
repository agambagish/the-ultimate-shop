"use client";

import { use, useMemo, useState } from "react";

import type { products } from "@/db/schema";
import { DataTable } from "@/features/data-table/components/data-table";
import { DataTableSortList } from "@/features/data-table/components/data-table-sort-list";
import { DataTableToolbar } from "@/features/data-table/components/data-table-toolbar";
import { useDataTable } from "@/features/data-table/hooks/use-data-table";
import type { DataTableRowAction } from "@/features/data-table/lib/types";
import { CreateProductSheet } from "@/features/product/components/create-product-sheet";
import { DeleteProductsDialog } from "@/features/product/components/delete-products-dialog";
import { ProductsTableActionBar } from "@/features/product/components/products-table-action-bar";
import { getProductsTableColumns } from "@/features/product/components/products-table-columns";
import { UpdateProductSheet } from "@/features/product/components/update-product-sheet";
import type {
  getCategories,
  getProductStatusCounts,
  getProducts,
} from "@/features/product/queries";

interface Props {
  promises: Promise<
    [
      Awaited<ReturnType<typeof getProducts>>,
      Awaited<ReturnType<typeof getProductStatusCounts>>,
    ]
  >;
  categoriesPromise: Promise<Awaited<ReturnType<typeof getCategories>>>;
}

export function ProductsTable({ promises, categoriesPromise }: Props) {
  const [{ data, pageCount }, statusCounts] = use(promises);

  const [rowAction, setRowAction] = useState<DataTableRowAction<
    typeof products.$inferSelect
  > | null>(null);

  const columns = useMemo(
    () =>
      getProductsTableColumns({
        statusCounts,
        setRowAction,
      }),
    [statusCounts]
  );

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    initialState: {
      sorting: [{ id: "createdAt", desc: true }],
      columnPinning: { right: ["actions"] },
    },
    getRowId: (originalRow) => String(originalRow.id),
    shallow: false,
    clearOnDefault: true,
  });

  return (
    <>
      <DataTable
        table={table}
        actionBar={<ProductsTableActionBar table={table} />}
      >
        <DataTableToolbar table={table}>
          <CreateProductSheet categoriesPromise={categoriesPromise} />
          <DataTableSortList table={table} align="end" />
        </DataTableToolbar>
      </DataTable>
      <UpdateProductSheet
        open={rowAction?.variant === "update"}
        onOpenChange={() => setRowAction(null)}
        product={rowAction?.row.original ?? null}
        categoriesPromise={categoriesPromise}
      />
      <DeleteProductsDialog
        open={rowAction?.variant === "delete"}
        onOpenChange={() => setRowAction(null)}
        products={rowAction?.row.original ? [rowAction.row.original] : []}
        showTrigger={false}
        onSuccess={() => rowAction?.row.toggleSelected(false)}
      />
    </>
  );
}
