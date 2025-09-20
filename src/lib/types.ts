import type { Category } from "@/payload-types";

export type CategoryWithSubCategory = Category & {
  subcategories: Omit<Category, "subcategories">[];
};
