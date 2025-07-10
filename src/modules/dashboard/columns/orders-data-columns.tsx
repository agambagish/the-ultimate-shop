"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { cn, formatDate, formatPrice } from "@/lib/utils";

interface Order {
  id: number;
  customer: string;
  email: string;
  isPaid: boolean;
  subtotal: string;
  total: string;
  createdAt: Date;
  discount: string;
}

export const ordersDataColumns: ColumnDef<Order>[] = [
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
    accessorKey: "subtotal",
    header: "Subtotal",
    cell: ({ row }) => formatPrice(row.getValue("subtotal")),
  },
  {
    accessorKey: "total",
    header: "Total",
    cell: ({ row }) => formatPrice(row.getValue("total")),
  },
  {
    accessorKey: "createdAt",
    header: "Ordered At",
    cell: ({ row }) =>
      formatDate(row.getValue("createdAt"), {
        hour: "2-digit",
        minute: "2-digit",
      }),
  },
  {
    accessorKey: "discount",
    header: "Discount",
    cell: ({ row }) => (
      <Badge variant="destructive">
        {formatPrice(row.getValue("discount"))}
      </Badge>
    ),
  },
];
