"use server";

import { db } from "@/db";
import { tryCatch } from "@/lib/try-catch";

export async function getCategories() {
  const categories = await tryCatch(
    db.query.productsCategories.findMany({
      columns: {
        id: true,
        label: true,
      },
    })
  );

  if (categories.error) return [];

  return categories.data;
}
