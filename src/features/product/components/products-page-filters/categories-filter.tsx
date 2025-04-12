"use client";

import Link from "next/link";
import { use } from "react";

import { ChevronRightIcon } from "lucide-react";

import type { getCategories } from "@/features/product/queries";

interface Props {
  categoriesPromise: Promise<Awaited<ReturnType<typeof getCategories>>>;
}

export function CategoriesFilter({ categoriesPromise }: Props) {
  const { categories } = use(categoriesPromise);

  return (
    <div className="flex flex-col space-y-0.5 text-black/60">
      {categories.map((c, i) => (
        <Link
          key={i}
          href={`/products?category=${c.slug}`}
          className="flex items-center justify-between py-1.5 text-sm"
        >
          {c.label} <ChevronRightIcon className="size-4" />
        </Link>
      ))}
    </div>
  );
}
