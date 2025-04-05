"use server";

import { count, desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { categories, products } from "@/db/schema";
import { unstable_cache } from "@/lib/unstable-cache";

export async function getFeaturedCategories() {
  return await unstable_cache(
    async () => {
      try {
        const data = await db
          .select({
            label: categories.label,
            slug: categories.slug,
            imageUrl: categories.imageUrl,
            productCount: count(products.id),
          })
          .from(categories)
          .leftJoin(products, eq(categories.id, products.categoryId))
          .groupBy(categories.id)
          .limit(4)
          .orderBy(desc(count(products.id)));

        return { categories: data };
      } catch {
        return { categories: [] };
      }
    },
    ["featured-categories"],
    {
      revalidate: 1,
    }
  )();
}
