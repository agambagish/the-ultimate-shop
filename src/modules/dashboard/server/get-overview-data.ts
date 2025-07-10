"use server";

import { and, count, eq, sum } from "drizzle-orm";

import { db } from "@/db";
import { orders, ordersItems, products, stores } from "@/db/schema";
import { tryCatch } from "@/lib/try-catch";

export async function getOverviewData(slug: string) {
  const calculation = await tryCatch(
    db.transaction(async (tx) => {
      const ordersItemsCalculation = await tryCatch(
        tx
          .select({
            revenue: sum(ordersItems.priceAtPurchase),
            unitsSold: count(ordersItems.id),
          })
          .from(ordersItems)
          .innerJoin(orders, eq(orders.id, ordersItems.orderId))
          .where(and(eq(orders.isPaid, true), eq(ordersItems.storeSlug, slug)))
      );

      if (
        ordersItemsCalculation.error ||
        ordersItemsCalculation.data.length === 0
      )
        throw new Error("Orders Items calculation error");

      const productsCalculation = await tryCatch(
        tx
          .select({
            count: count(products.id),
          })
          .from(products)
          .innerJoin(stores, eq(stores.id, products.storeId))
          .where(eq(stores.slug, slug))
      );

      if (productsCalculation.error || productsCalculation.data.length === 0)
        throw new Error("Products calculation error");

      return {
        revenue: ordersItemsCalculation.data[0].revenue ?? "0.00",
        unitsSold: ordersItemsCalculation.data[0].unitsSold ?? 0,
        productCount: productsCalculation.data[0].count ?? 0,
      };
    })
  );

  if (calculation.error) {
    return {
      revenue: "0.00",
      unitsSold: 0,
      productCount: 0,
    };
  }

  return {
    revenue: calculation.data.revenue,
    unitsSold: calculation.data.unitsSold,
    productCount: calculation.data.productCount,
  };
}
