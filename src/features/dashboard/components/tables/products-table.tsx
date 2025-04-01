"use client";

import { use, useMemo, useState } from "react";

import type { products } from "@/db/schema";
import type {
  getProductStatusCounts,
  getProducts,
} from "@/features/dashboard/actions/product";
import { DeleteProductsDialog } from "@/features/dashboard/components/dialogs/delete-products-dialog";
import { ProductsTableActionBar } from "@/features/dashboard/components/tables/products-table-action-bar";
import { getProductsTableColumns } from "@/features/dashboard/components/tables/products-table-columns";
import { DataTable } from "@/features/data-table/components/data-table";
import { DataTableSortList } from "@/features/data-table/components/data-table-sort-list";
import { DataTableToolbar } from "@/features/data-table/components/data-table-toolbar";
import { useDataTable } from "@/features/data-table/hooks/use-data-table";
import type { DataTableRowAction } from "@/features/data-table/lib/types";

interface Props {
  promises: Promise<
    [
      Awaited<ReturnType<typeof getProducts>>,
      Awaited<ReturnType<typeof getProductStatusCounts>>,
    ]
  >;
}

export function ProductsTable({ promises }: Props) {
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
      sorting: [{ id: "createdAt", desc: false }],
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
          <DataTableSortList table={table} align="end" />
        </DataTableToolbar>
      </DataTable>
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
