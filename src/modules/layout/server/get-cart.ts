"use server";

import { eq, inArray } from "drizzle-orm";

import { db } from "@/db";
import { products, productsCategories, stores } from "@/db/schema";
import { tryCatch } from "@/lib/try-catch";

export async function getCart(items: { slug: string }[]) {
  const slugs = items.map(({ slug }) => slug);
  const uniqueSlugs = Array.from(new Set(slugs));

  const productsData = await tryCatch(
    db
      .select({
        title: products.title,
        slug: products.slug,
        price: products.price,
        category: productsCategories.label,
        discountPercentage: products.discountPercentage,
        thumbnailImageURL: products.thumbnailImageURL,
        storeId: stores.id,
        storeSlug: stores.slug,
      })
      .from(products)
      .innerJoin(
        productsCategories,
        eq(products.productCategoryId, productsCategories.id)
      )
      .innerJoin(stores, eq(products.storeId, stores.id))
      .where(inArray(products.slug, uniqueSlugs))
  );

  if (productsData.error)
    return {
      cart: [],
      subtotal: 0,
      discount: 0,
      total: 0,
    };

  const subtotal = productsData.data.reduce(
    (total, item) => total + Number(item.price),
    0
  );

  const discount = productsData.data.reduce(
    (total, item) =>
      total + (Number(item.price) * item.discountPercentage) / 100,
    0
  );

  return {
    cart: productsData.data,
    subtotal: Math.round(subtotal),
    discount: Math.round(discount),
    total: Math.round(subtotal - discount),
  };
}
