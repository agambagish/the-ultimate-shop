import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { inArray } from "drizzle-orm";

import { db } from "@/db";
import { products } from "@/db/schema";

export async function POST(req: NextRequest) {
  const data: { slug: string }[] = await req.json();

  const slugs = data.map(({ slug }) => slug);
  const uniqueSlugs = Array.from(new Set(slugs));

  const productsData = await db
    .select({
      title: products.title,
      slug: products.slug,
      price: products.price,
      discountPercentage: products.discountPercentage,
      thumbnailImageURL: products.thumbnailImageURL,
    })
    .from(products)
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
