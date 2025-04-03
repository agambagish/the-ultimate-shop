"use client";

import { type Dispatch, useTransition } from "react";

import type { ColumnDef } from "@tanstack/react-table";
import {
  CalendarIcon,
  CheckCircle2Icon,
  CircleDashedIcon,
  CircleIcon,
  CircleXIcon,
  EllipsisIcon,
  TextIcon,
  TimerIcon,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { products } from "@/db/schema";
import { DataTableColumnHeader } from "@/features/data-table/components/data-table-column-header";
import type { DataTableRowAction } from "@/features/data-table/lib/types";
import { updateProductStatus } from "@/features/product/actions";
import { formatDate, formatPrice } from "@/lib/utils";

interface Props {
  statusCounts: Record<(typeof products.$inferSelect)["status"], number>;
  setRowAction: Dispatch<
    React.SetStateAction<DataTableRowAction<
      typeof products.$inferSelect
    > | null>
  >;
}

export function getProductsTableColumns({
  setRowAction,
  statusCounts,
}: Props): ColumnDef<typeof products.$inferSelect>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          className="translate-y-0.5"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          className="translate-y-0.5"
        />
      ),
      enableSorting: false,
      enableHiding: false,
      size: 40,
    },
    {
      id: "id",
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="#" />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: "title",
      accessorKey: "title",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Title" />
      ),
      cell: ({ cell }) => (
        <div className="w-52 truncate font-medium">
          {cell.getValue<string>()}
        </div>
      ),
      meta: {
        label: "Title",
        placeholder: "Search titles...",
        variant: "text",
        icon: TextIcon,
      },
      enableColumnFilter: true,
    },
    {
      id: "price",
      accessorKey: "price",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Price" />
      ),
      cell: ({ cell }) => (
        <span className="tabular-nums">
          {formatPrice(cell.getValue<string>())}
        </span>
      ),
      meta: {
        label: "Price",
      },
    },
    {
      id: "inventory",
      accessorKey: "inventory",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Inventory" />
      ),
      cell: ({ cell }) => (
        <span className="tabular-nums">{cell.getValue<number>()}</span>
      ),
      meta: {
        label: "Inventory",
      },
    },
    {
      id: "status",
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ cell }) => {
        const status = products.status.enumValues.find(
          (status) =>
            status === cell.getValue<(typeof products.$inferSelect)["status"]>()
        );

        if (!status) return null;

        const Icon = getStatusIcon(status);

        return (
          <Badge
            variant={
              (status === "active" && "success") ||
              (status === "draft" && "outline") ||
              (status === "archived" && "destructive") ||
              "default"
            }
            className="py-1 [&>svg]:size-3.5"
          >
            <Icon />
            <span className="capitalize">{status}</span>
          </Badge>
        );
      },
      meta: {
        label: "Status",
        variant: "multiSelect",
        options: products.status.enumValues.map((status) => ({
          label: status.charAt(0).toUpperCase() + status.slice(1),
          value: status,
          count: statusCounts[status],
          icon: getStatusIcon(status),
        })),
        icon: CircleDashedIcon,
      },
      enableColumnFilter: true,
    },
    {
      id: "createdAt",
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Created At" />
      ),
      cell: ({ cell }) => formatDate(cell.getValue<Date>()),
      meta: {
        label: "Created At",
        variant: "dateRange",
        icon: CalendarIcon,
      },
      enableColumnFilter: true,
    },
    {
      id: "actions",
      cell: function Cell({ row }) {
        const [isUpdatePending, startUpdateTransition] = useTransition();

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="data-[state=open]:bg-muted flex size-8 p-0"
              >
                <EllipsisIcon className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem
                onSelect={() => setRowAction({ row, variant: "update" })}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Status</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuRadioGroup
                    value={row.original.status}
                    onValueChange={(value) => {
                      startUpdateTransition(() => {
                        toast.promise(
                          updateProductStatus({
                            productIds: [row.original.id],
                            status:
                              value as (typeof products.status.enumValues)[number],
                          }),
                          {
                            loading: "Updating product status...",
                            success: "Product status updated",
                            error: "Something went wrong",
                          }
                        );
                      });
                    }}
                  >
                    {products.status.enumValues.map((label) => (
                      <DropdownMenuRadioItem
                        key={label}
                        value={label}
                        className="capitalize"
                        disabled={isUpdatePending}
                      >
                        {label}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() => setRowAction({ row, variant: "delete" })}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      size: 40,
    },
  ];
}

function getStatusIcon(status: (typeof products.$inferSelect)["status"]) {
  const statusIcons = {
    active: CheckCircle2Icon,
    draft: TimerIcon,
    archived: CircleXIcon,
  };

  return statusIcons[status] || CircleIcon;
}
