import Link from "next/link";

import type { CategoryWithSubCategory } from "@/lib/types";

interface Props {
  category: CategoryWithSubCategory;
  isOpen: boolean;
  position: { top: number; left: number };
}

export function SubcategoryMenu({ category, isOpen, position }: Props) {
  if (
    !isOpen ||
    !category.subcategories ||
    category.subcategories.length === 0
  ) {
    return null;
  }

  return (
    <div
      className="fixed z-100"
      style={{
        top: position.top,
        left: position.left,
      }}
    >
      <div className="h-3 w-60" />
      <div className="w-60 overflow-hidden rounded-2xl border text-black">
        {category.subcategories.map((subcategory) => (
          <Link
            key={subcategory.slug}
            href={`/${category.slug}/${subcategory.slug}`}
            className="flex w-full items-center justify-between p-4 text-left font-medium hover:bg-black hover:text-white hover:underline"
          >
            {subcategory.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
