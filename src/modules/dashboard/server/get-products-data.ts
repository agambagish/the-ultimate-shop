"use server";

import { auth } from "@clerk/nextjs/server";
import { and, desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { products, productsCategories, stores } from "@/db/schema";
import { tryCatch } from "@/lib/try-catch";

export async function getProductsData(slug: string) {
  const { userId } = await auth();

  if (!userId) return [];
  const productsData = await tryCatch(
    db
      .select({
        id: products.id,
        title: products.title,
        slug: products.slug,
        price: products.price,
        discountPercentage: products.discountPercentage,
        category: productsCategories.label,
        rating: products.rating,
        storeSlug: stores.slug,
      })
      .from(products)
      .where(and(eq(stores.slug, slug), eq(stores.userId, userId)))
      .innerJoin(stores, eq(stores.slug, slug))
      .innerJoin(
        productsCategories,
        eq(productsCategories.id, products.productCategoryId)
      )
      .orderBy(desc(products.createdAt))
  );

  if (productsData.error) return [];

  return productsData.data;
}
