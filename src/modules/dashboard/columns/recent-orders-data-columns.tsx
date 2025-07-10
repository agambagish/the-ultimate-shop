"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { cn, formatPrice } from "@/lib/utils";

interface Order {
  id: number;
  customer: string;
  email: string;
  isPaid: boolean;
  amount: string;
}

export const recentOrdersDataColumns: ColumnDef<Order>[] = [
  {
    accessorKey: "id",
    header: "#",
  },
  {
    accessorKey: "customer",
    header: "Customer",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "isPaid",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        className={cn(
          (row.getValue("isPaid") as boolean) && "bg-green-600 text-white"
        )}
        variant="outline"
      >
        {(row.getValue("isPaid") as boolean) ? "Paid" : "Pending"}
      </Badge>
    ),
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => formatPrice(row.getValue("amount")),
  },
];
