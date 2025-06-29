"use server";

import { and, desc, eq, ne } from "drizzle-orm";

import { db } from "@/db";
import { products, stores } from "@/db/schema";
import { tryCatch } from "@/lib/try-catch";

export async function getRelatedProducts(slug: string, limit = 6) {
  const currentProduct = await tryCatch(
    db
      .select({
        id: products.id,
        storeId: products.storeId,
      })
      .from(products)
      .where(eq(products.slug, slug))
  );

  if (currentProduct.error || currentProduct.data.length === 0) return [];

  const relatedProducts = await tryCatch(
    db
      .select({
        title: products.title,
        slug: products.slug,
        description: products.description,
        price: products.price,
        storeName: stores.name,
        storeSlug: stores.slug,
        discountPercentage: products.discountPercentage,
        rating: products.rating,
        thumbnailImageURL: products.thumbnailImageURL,
      })
      .from(products)
      .innerJoin(stores, eq(products.storeId, stores.id))
      .where(
        and(
          eq(products.storeId, currentProduct.data[0].storeId),
          ne(products.slug, slug)
        )
      )
      .orderBy(desc(products.rating), desc(products.updatedAt))
      .limit(limit)
  );

  if (relatedProducts.error) return [];

  return relatedProducts.data;
}
