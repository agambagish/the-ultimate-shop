"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";

interface Sale {
  id: string;
  amount: string;
  customer: string;
  email: string;
  status: "Yet to deliver" | "Delivered" | "Cancelled";
}

export const recentOrdersColumns: ColumnDef<Sale>[] = [
  {
    accessorKey: "id",
    header: "#",
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => formatPrice(row.getValue("amount")),
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
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        variant={
          (row.getValue("status") === "Yet to deliver" && "outline") ||
          (row.getValue("status") === "Delivered" && "default") ||
          (row.getValue("status") === "Cancelled" && "destructive") ||
          "default"
        }
      >
        {row.getValue("status")}
      </Badge>
    ),
  },
];
