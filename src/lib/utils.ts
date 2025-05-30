import { useClerk } from "@clerk/nextjs";
import type { User } from "@clerk/nextjs/server";
import type { Table } from "@tanstack/react-table";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getEmail(user: User) {
  return (
    user?.emailAddresses.find(
      (email) => email.id === user.primaryEmailAddressId
    )?.emailAddress ?? ""
  );
}

export function useGetEmail() {
  const { user } = useClerk();
  return (
    user?.emailAddresses.find(
      (email) => email.id === user.primaryEmailAddressId
    )?.emailAddress ?? ""
  );
}

export function formatPrice(
  price: number | string,
  opts: Intl.NumberFormatOptions = {}
) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: opts.currency ?? "INR",
    notation: opts.notation ?? "standard",
    ...opts,
  }).format(Number(price));
}

export function formatBytes(
  bytes: number,
  opts: {
    decimals?: number;
    sizeType?: "accurate" | "normal";
  } = {}
) {
  const { decimals = 0, sizeType = "normal" } = opts;

  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const accurateSizes = ["Bytes", "KiB", "MiB", "GiB", "TiB"];
  if (bytes === 0) return "0 Byte";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${
    sizeType === "accurate"
      ? (accurateSizes[i] ?? "Bytes")
      : (sizes[i] ?? "Bytes")
  }`;
}

export function formatDate(
  date: Date | string | number,
  opts: Intl.DateTimeFormatOptions = {}
) {
  return new Intl.DateTimeFormat("en-IN", {
    month: opts.month ?? "long",
    day: opts.day ?? "numeric",
    year: opts.year ?? "numeric",
    ...opts,
  }).format(new Date(date));
}

export function exportTableToCSV<TData>(
  table: Table<TData>,
  opts: {
    filename?: string;
    excludeColumns?: (keyof TData | "select" | "actions")[];
    onlySelected?: boolean;
  } = {}
): void {
  const {
    filename = crypto.randomUUID(),
    excludeColumns = [],
    onlySelected = false,
  } = opts;

  const headers = table
    .getAllLeafColumns()
    .map((column) => column.id)
    // @ts-expect-error ID is file to pass
    .filter((id) => !excludeColumns.includes(id));

  const csvContent = [
    headers.join(","),
    ...(onlySelected
      ? table.getFilteredSelectedRowModel().rows
      : table.getRowModel().rows
    ).map((row) =>
      headers
        .map((header) => {
          const cellValue = row.getValue(header);
          return typeof cellValue === "string"
            ? // eslint-disable-next-line quotes
              `"${cellValue.replace(/"/g, '""')}"`
            : cellValue;
        })
        .join(",")
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function getUpdatedValues<T extends Record<string, unknown>>(
  source: T,
  filter: Partial<Record<keyof T, boolean>>
): Partial<T> {
  const result: Partial<T> = {};
  for (const key in filter) {
    if (filter[key] === true && key in source) {
      result[key] = source[key];
    }
  }
  return result;
}

export function calculatePrices(
  items: { price: string; discountedPrice: string; qty: number }[] | undefined
) {
  const subtotal =
    items?.reduce((total, item) => total + item.qty * Number(item.price), 0) ??
    0;

  const total =
    items?.reduce(
      (total, item) =>
        total +
        item.qty *
          (Number(item.discountedPrice) > 0
            ? Number(item.discountedPrice)
            : Number(item.price)),
      0
    ) ?? 0;

  return {
    total,
    subtotal,
    discount: Number(total - subtotal).toFixed(2),
    discountPercentage: Number(((total - subtotal) / subtotal) * 100).toFixed(
      2
    ),
  };
}

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function pgEncoder(payload: string) {
  return payload
    .replace(/'/g, "--quote--")
    .replace(/,/g, "--comma--")
    .replace(/[^a-zA-Z0-9 \-]/g, "");
}

export function pgDecoder(payload: string) {
  return payload.replace(/--quote--/g, "'").replace(/--comma--/g, ",");
}
