import { desc, eq, gt } from "drizzle-orm";

import { db } from "@/db";
import { products, stores } from "@/db/schema";
import { tryCatch } from "@/lib/try-catch";

export async function getTrendingProducts() {
  const trendingProducts = await tryCatch(
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
      .where(gt(products.rating, 3))
      .innerJoin(stores, eq(products.storeId, stores.id))
      .orderBy(
        desc(products.rating),
        desc(products.discountPercentage),
        desc(products.updatedAt)
      )
      .limit(10)
  );

  if (trendingProducts.error) {
    return [];
  }

  return trendingProducts.data;
}
