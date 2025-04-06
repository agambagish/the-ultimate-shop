import type { NavItem } from "@/features/layouts/lib/types";
import { getCategories } from "@/features/product/queries";

export async function getNavItems(): Promise<NavItem[]> {
  const { categories } = await getCategories();

  return [
    {
      label: "Shop",
      type: "list",
      children: categories.map((c) => ({
        label: c.label,
        description:
          "Lorem ipsum, dolor sit amet consectetur adipisicing elit.",
        url: `/products?category=${c.slug}`,
      })),
    },
    {
      label: "On Sale",
      type: "item",
      url: "#",
      children: [],
    },
  ];
}
