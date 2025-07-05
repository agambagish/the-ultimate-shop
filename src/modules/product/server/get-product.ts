"use server";

import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import {
  orders,
  ordersItems,
  products,
  productsAssets,
  stores,
} from "@/db/schema";
import { tryCatch } from "@/lib/try-catch";

export async function getProduct(slug: string) {
  const session = await auth();

  const product = await tryCatch(
    db
      .select({
        title: products.title,
        description: products.description,
        longDescription: products.longDescription,
        price: products.price,
        storeName: stores.name,
        storeSlug: stores.slug,
        discountPercentage: products.discountPercentage,
        rating: products.rating,
        imageURL1: products.imageURL1,
        imageURL2: products.imageURL2,
        imageURL3: products.imageURL3,
        imageURL4: products.imageURL4,
        imageURL5: products.imageURL5,
        updatedAt: products.updatedAt,
        productAssetFileName: productsAssets.fileName,
        productAssetMimeType: productsAssets.mimeType,
        productAssetSize: productsAssets.size,
        productAssetPinataCID: productsAssets.pinataCID,
      })
      .from(products)
      .where(eq(products.slug, slug))
      .innerJoin(stores, eq(products.storeId, stores.id))
      .innerJoin(productsAssets, eq(products.productAssetId, productsAssets.id))
  );

  if (product.error) {
    return null;
  }

  const order = await tryCatch(
    db
      .select({
        id: orders.id,
      })
      .from(orders)
      .innerJoin(
        ordersItems,
        and(
          eq(ordersItems.orderId, orders.id),
          eq(ordersItems.productSlug, slug)
        )
      )
      .where(eq(orders.userId, session.userId ?? ""))
  );

  if (order.error) {
    return null;
  }

  return {
    ...product.data[0],
    orderId: order.data.length !== 0 ? order.data[0].id : null,
  };
}
