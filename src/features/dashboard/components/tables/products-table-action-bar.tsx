"use client";

import { useCallback, useState, useTransition } from "react";

import type { Table } from "@tanstack/react-table";
import {
  CheckCircle2Icon,
  DownloadIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { productStatusEnum } from "@/db/schema";
import { products } from "@/db/schema";
import {
  deleteProducts,
  updateProductStatus,
} from "@/features/dashboard/actions/product";
import {
  DataTableActionBar,
  DataTableActionBarAction,
} from "@/features/data-table/components/data-table-action-bar";
import { exportTableToCSV } from "@/lib/utils";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const actions = ["update-status", "export", "delete"] as const;

type Action = (typeof actions)[number];

interface Props {
  table: Table<typeof products.$inferSelect>;
}

export function ProductsTableActionBar({ table }: Props) {
  const rows = table.getFilteredSelectedRowModel().rows;
  const [isPending, startTransition] = useTransition();
  const [currentAction, setCurrentAction] = useState<Action | null>(null);

  const getIsActionPending = useCallback(
    (action: Action) => isPending && currentAction === action,
    [isPending, currentAction]
  );

  const onStatusUpdate = useCallback(
    ({ status }: { status: (typeof productStatusEnum.enumValues)[number] }) => {
      setCurrentAction("update-status");
      startTransition(async () => {
        const { error } = await updateProductStatus({
          productIds: rows.map((row) => row.original.id),
          status,
        });

        if (error) {
          toast.error(error);
          return;
        }

        toast.success("Product(s) updated");
      });
    },
    [rows]
  );

  const onExport = useCallback(() => {
    setCurrentAction("export");
    startTransition(() => {
      exportTableToCSV(table, {
        excludeColumns: ["select", "actions"],
        onlySelected: true,
      });
    });
  }, [table]);

  const onDelete = useCallback(() => {
    setCurrentAction("delete");
    startTransition(async () => {
      const { error } = await deleteProducts({
        productIds: rows.map((row) => row.original.id),
      });

      if (error) {
        toast.error(error);
        return;
      }
      table.toggleAllRowsSelected(false);
    });
  }, [rows, table]);

  return (
    <DataTableActionBar table={table} visible={rows.length > 0}>
      <div className="flex h-7 items-center rounded-md border pr-1 pl-2.5">
        <span className="text-xs whitespace-nowrap">
          {rows.length} selected
        </span>
        <Separator
          orientation="vertical"
          className="mr-1 ml-2 data-[orientation=vertical]:h-4"
        />
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-5 [&>svg]:size-3.5"
              onClick={() => table.toggleAllRowsSelected(false)}
            >
              <XIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="bg-accent text-foreground flex items-center gap-2 border px-2 py-1 font-semibold dark:bg-zinc-900">
            <p>Clear selection</p>
            <kbd className="bg-background text-foreground rounded border px-1.5 py-px font-mono text-[0.7rem] font-normal shadow-xs select-none disabled:opacity-50">
              <abbr title="Escape" className="no-underline">
                Esc
              </abbr>
            </kbd>
          </TooltipContent>
        </Tooltip>
      </div>
      <Separator
        orientation="vertical"
        className="hidden data-[orientation=vertical]:h-5 sm:block"
      />
      <div className="flex items-center gap-1.5">
        <Select
          onValueChange={(status: (typeof products.$inferSelect)["status"]) =>
            onStatusUpdate({ status })
          }
        >
          <SelectTrigger asChild>
            <DataTableActionBarAction
              size="icon"
              tooltip="Update status"
              isPending={getIsActionPending("update-status")}
            >
              <CheckCircle2Icon />
            </DataTableActionBarAction>
          </SelectTrigger>
          <SelectContent align="center">
            <SelectGroup>
              {products.status.enumValues.map((status) => (
                <SelectItem key={status} value={status} className="capitalize">
                  {status}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <DataTableActionBarAction
          size="icon"
          tooltip="Export tasks"
          isPending={getIsActionPending("export")}
          onClick={onExport}
        >
          <DownloadIcon />
        </DataTableActionBarAction>
        <DataTableActionBarAction
          size="icon"
          tooltip="Delete tasks"
          isPending={getIsActionPending("delete")}
          onClick={onDelete}
        >
          <Trash2Icon />
        </DataTableActionBarAction>
      </div>
    </DataTableActionBar>
  );
}
