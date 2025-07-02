"use server";

import { db } from "@/db";
import { productsCategories } from "@/db/schema";
import { tryCatch } from "@/lib/try-catch";

export async function getCategories() {
  const categories = await tryCatch(
    db
      .select({
        id: productsCategories.id,
        label: productsCategories.label,
        slug: productsCategories.slug,
        description: productsCategories.description,
        icon: productsCategories.icon,
      })
      .from(productsCategories)
  );

  if (categories.error) {
    return [];
  }

  return categories.data;
}
