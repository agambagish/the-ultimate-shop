import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { eq, inArray } from "drizzle-orm";

import { db } from "@/db";
import { products, productsCategories, stores } from "@/db/schema";

export async function POST(req: NextRequest) {
  const data: { slug: string }[] = await req.json();

  const slugs = data.map(({ slug }) => slug);
  const uniqueSlugs = Array.from(new Set(slugs));

  const productsData = await db
    .select({
      title: products.title,
      slug: products.slug,
      price: products.price,
      category: productsCategories.label,
      discountPercentage: products.discountPercentage,
      thumbnailImageURL: products.thumbnailImageURL,
      storeId: stores.id,
    })
    .from(products)
    .innerJoin(
      productsCategories,
      eq(products.productCategoryId, productsCategories.id)
    )
    .leftJoin(stores, eq(products.storeId, stores.id))
    .where(inArray(products.slug, uniqueSlugs));

  const subtotal = productsData.reduce(
    (total, item) => total + Number(item.price),
    0
  );
  const discount = productsData.reduce(
    (total, item) =>
      total + (Number(item.price) * item.discountPercentage) / 100,
    0
  );

  return NextResponse.json({
    cart: productsData,
    subtotal,
    discount,
    total: subtotal - discount,
  });
}
