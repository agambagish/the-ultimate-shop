"use server";

import { count, eq } from "drizzle-orm";

import { db } from "@/db";
import { products, stores } from "@/db/schema";
import { tryCatch } from "@/lib/try-catch";

export async function getFeaturedStores() {
  const featuredStores = await tryCatch(
    db
      .select({
        name: stores.name,
        slug: stores.slug,
        description: stores.description,
        status: stores.status,
        productCount: count(products.id),
      })
      .from(stores)
      .leftJoin(products, eq(products.storeId, stores.id))
      .limit(6)
      .groupBy(stores.name, stores.slug, stores.description, stores.status)
  );

  if (featuredStores.error) return [];

  return featuredStores.data;
}
