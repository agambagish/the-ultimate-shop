"use server";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { products, stores } from "@/db/schema";
import { tryCatch } from "@/lib/try-catch";

export async function getProductsData(slug: string) {
  const { data: productsData, error } = await tryCatch(
    db
      .select({
        id: products.id,
        title: products.title,
        price: products.price,
        discountPercentage: products.discountPercentage,
        fileTypes: products.fileTypes,
        rating: products.rating,
      })
      .from(products)
      .where(eq(stores.slug, slug))
      .leftJoin(stores, eq(stores.slug, slug))
  );

  if (error) return [];

  return productsData;
}
