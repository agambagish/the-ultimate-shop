import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatAsCurrency(value: string) {
  const numericValue = value.replace(/[^0-9.]/g, "");

  const parts = numericValue.split(".");
  const formattedValue =
    parts[0] + (parts.length > 1 ? `.${parts[1]?.slice(0, 2)}` : "");

  if (!formattedValue) return "";
  const numberValue = parseFloat(formattedValue);
  if (Number.isNaN(numberValue)) return "";

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(numberValue);
}

export function generateStoreURL(subdomain: string) {
  return `/stores/${subdomain}`;
}
