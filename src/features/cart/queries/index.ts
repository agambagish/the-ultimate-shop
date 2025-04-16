"use server";

import { eq, inArray } from "drizzle-orm";

import { db } from "@/db";
import { categories, products } from "@/db/schema";
import { tryCatch } from "@/lib/try-catch";

export async function getCart(items: { productId: number; qty: number }[]) {
  const productIds = [...new Set(items.map((i) => i.productId))];

  const { data, error } = await tryCatch(
    db
      .select({
        id: products.id,
        title: products.title,
        price: products.price,
        images: products.images,
        category: categories.label,
      })
      .from(products)
      .where(inArray(products.id, productIds))
      .leftJoin(categories, eq(products.categorySlug, categories.slug))
      .then((fetchedProducts) => {
        return fetchedProducts.map((fp) => {
          const qty = items.find(
            (cartItem) => cartItem.productId === fp.id
          )?.qty;

          return {
            ...fp,
            qty: qty ?? 0,
            category: fp.category ?? "",
          };
        });
      })
  );

  if (error) {
    return [];
  }

  return data;
}
