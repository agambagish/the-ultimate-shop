"use server";

import { auth } from "@clerk/nextjs/server";
import { and, count, eq, sql } from "drizzle-orm";

import { db } from "@/db";
import {
  type OrderItem,
  type Product,
  orders,
  ordersItems,
  products,
  productsAssets,
} from "@/db/schema";
import { tryCatch } from "@/lib/try-catch";

type Item = Pick<OrderItem, "id" | "priceAtPurchase"> &
  Pick<Product, "title" | "slug" | "thumbnailImageURL"> & {
    productAssetFileName: string;
    productAssetSize: number;
    productAssetMimeType: string;
    productAssetPinataCID: string;
  };

export async function getOrderByTxnid(txnid: string) {
  const session = await auth();

  const order = await tryCatch(
    db
      .select({
        id: orders.id,
        isPaid: orders.isPaid,
        subtotal: orders.subtotal,
        discount: orders.discount,
        total: orders.total,
        itemCount: count(ordersItems.id),
        createdAt: orders.createdAt,
        items: sql<Item[]>`
                  json_agg(
                    json_build_object(
                      'id', ${ordersItems.id},
                      'title', ${products.title},
                      'slug', ${products.slug},
                      'thumbnailImageURL', ${products.thumbnailImageURL},
                      'priceAtPurchase', ${ordersItems.priceAtPurchase},
                      'productAssetFileName', ${productsAssets.fileName},
                      'productAssetSize', ${productsAssets.size},
                      'productAssetMimeType', ${productsAssets.mimeType},
                      'productAssetPinataCID', ${productsAssets.pinataCID}
                    )
                  )
                `,
      })
      .from(orders)
      .innerJoin(ordersItems, eq(ordersItems.orderId, orders.id))
      .innerJoin(products, eq(ordersItems.productSlug, products.slug))
      .innerJoin(productsAssets, eq(products.productAssetId, productsAssets.id))
      .where(
        and(
          eq(orders.userId, session.userId ?? ""),
          eq(orders.transactionId, txnid),
          eq(orders.isPaid, true)
        )
      )
      .groupBy(orders.id)
  );

  if (order.error || order.data.length === 0) {
    return null;
  }

  return order.data[0];
}
