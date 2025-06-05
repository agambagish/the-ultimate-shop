import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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
