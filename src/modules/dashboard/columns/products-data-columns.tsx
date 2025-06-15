"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import type { Product } from "@/db/schema";
import { formatPrice } from "@/lib/utils";

type ProductType = Pick<
  Product,
  "id" | "title" | "price" | "discountPercentage" | "fileTypes" | "rating"
>;

export const productsDataColumns: ColumnDef<ProductType>[] = [
  {
    accessorKey: "id",
    header: "#",
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => formatPrice(row.getValue("price")),
  },
  {
    accessorKey: "discountPercentage",
    header: "Discount",
    cell: ({ row }) => <Badge>{row.getValue("discountPercentage")}%</Badge>,
  },
  {
    accessorKey: "fileTypes",
    header: "File Types",
    cell: ({ row }) => (row.getValue("fileTypes") as string[]).join(", "),
  },
  {
    accessorKey: "rating",
    header: "Rating",
  },
];
