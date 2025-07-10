import { count, desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { ordersItems, products } from "@/db/schema";
import { tryCatch } from "@/lib/try-catch";

export async function getTopSellingProducts(slug: string, limit = 10) {
  const result = await tryCatch(
    db
      .select({
        title: products.title,
        unitsSold: count(ordersItems.id),
      })
      .from(ordersItems)
      .innerJoin(products, eq(products.slug, ordersItems.productSlug))
      .where(eq(ordersItems.storeSlug, slug))
      .orderBy(desc(count(ordersItems.id)))
      .groupBy(products.title)
      .limit(limit)
  );

  if (result.error) return [];

  return result.data;
}
