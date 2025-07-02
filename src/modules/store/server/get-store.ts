"use server";

import { count, eq } from "drizzle-orm";

import { db } from "@/db";
import { products, stores } from "@/db/schema";
import { tryCatch } from "@/lib/try-catch";

export async function getStore(slug: string) {
  const store = await tryCatch(
    db
      .select({
        name: stores.name,
        slug: stores.slug,
        description: stores.description,
        status: stores.status,
        city: stores.city,
        state: stores.state,
        country: stores.country,
        productCount: count(products.id),
      })
      .from(stores)
      .leftJoin(products, eq(products.storeId, stores.id))
      .where(eq(stores.slug, slug))
      .groupBy(
        stores.name,
        stores.slug,
        stores.description,
        stores.status,
        stores.city,
        stores.state,
        stores.country
      )
  );

  if (store.error || store.data.length === 0) return null;

  return store.data[0];
}
