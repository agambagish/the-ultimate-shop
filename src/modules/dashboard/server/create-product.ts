"use server";

import { auth } from "@clerk/nextjs/server";

import { db } from "@/db";
import { products } from "@/db/schema";
import { tryCatch } from "@/lib/try-catch";

import type { CreateProductSchema } from "../schemas/product-schema";

export async function createProduct(values: CreateProductSchema) {
  const { userId } = await auth();

  if (!userId) {
    return {
      data: null,
      error: "You are not signed in",
    };
  }

  const { data: store, error: storeErr } = await tryCatch(
    db.query.stores.findFirst({
      where: (f, o) => o.and(o.eq(f.userId, userId), o.eq(f.status, "active")),
      columns: { id: true },
    })
  );

  if (storeErr || !store?.id) {
    return {
      data: null,
      error: "Your store is deactivated",
    };
  }

  const { data, error } = await tryCatch(
    db
      .insert(products)
      .values({
        ...values,
        imageUrl: "",
        storeId: store.id,
      })
      .returning({
        title: products.title,
      })
  );

  if (error) {
    return {
      data: null,
      error: "Something went wrong",
    };
  }

  return {
    data: data[0].title,
    error: "Your store is deactivated",
  };
}
