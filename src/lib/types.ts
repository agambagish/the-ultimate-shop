import type { Category } from "@/payload-types";

export type CategoryWithSubCategory = Category & {
  subcategories: Omit<Category, "subcategories">[];
};

// biome-ignore lint/suspicious/noExplicitAny: _
export type StrictDefined<T> = T extends (...args: any) => any
  ? T
  : T extends object
    ? { [K in keyof T]-?: StrictDefined<NonNullable<T[K]>> }
    : NonNullable<T>;
