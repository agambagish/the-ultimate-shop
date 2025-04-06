"use server";

import { asc, count, desc, eq } from "drizzle-orm";

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

export async function getNewArrivals() {
  return await unstable_cache(
    async () => {
      try {
        const data = await db
          .select({
            id: products.id,
            title: products.title,
            price: products.price,
            images: products.images,
          })
          .from(products)
          .limit(15)
          .orderBy(asc(products.createdAt));

        return { products: data };
      } catch {
        return { products: [] };
      }
    },
    ["new-arrivals"],
    {
      revalidate: 1,
    }
  )();
}
