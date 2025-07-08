"use server";

import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import { products, stores } from "@/db/schema";
import { tryCatch } from "@/lib/try-catch";

export async function getProductData(slug: string) {
  const { userId } = await auth();

  const product = await tryCatch(
    db
      .select({
        title: products.title,
        description: products.description,
        slug: products.slug,
        longDescription: products.longDescription,
        price: products.price,
        discountPercentage: products.discountPercentage,
        thumbnailImageURL: products.thumbnailImageURL,
        imageURL1: products.imageURL1,
        imageURL2: products.imageURL2,
        imageURL3: products.imageURL3,
        imageURL4: products.imageURL4,
        imageURL5: products.imageURL5,
        productAssetId: products.productAssetId,
        productCategoryId: products.productCategoryId,
      })
      .from(products)
      .innerJoin(stores, eq(stores.id, products.storeId))
      .where(and(eq(products.slug, slug), eq(stores.userId, userId ?? "")))
  );

  if (product.error || product.data.length === 0) {
    return null;
  }

  return product.data[0];
}
