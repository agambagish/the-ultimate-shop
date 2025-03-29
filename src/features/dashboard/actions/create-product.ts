"use server";

import { auth } from "@clerk/nextjs/server";

import { db } from "@/db";
import { products } from "@/db/schema";
import type { CreateProductSchema } from "@/features/dashboard/lib/create-product-schema";
import { esBackendClient } from "@/lib/edgestore-server";
import { tryCatch } from "@/lib/try-catch";

export async function createProduct(
  product: Omit<CreateProductSchema, "images"> & {
    images: string[];
  }
) {
  const { userId } = await auth();

  if (!userId) {
    return {
      data: null,
      error: "Unauthorized",
    };
  }

  const { data: store, error: storeQueryError } = await tryCatch(
    db.query.stores.findFirst({
      where: (f, o) =>
        o.and(o.eq(f.userId, userId), o.eq(f.status, "activated")),
      columns: { id: true },
    })
  );

  if (storeQueryError || !store) {
    return {
      data: null,
      error: "Either you don't have any store or it has been deactivated",
    };
  }

  const { data: newProduct, error } = await tryCatch(
    db
      .insert(products)
      .values({
        ...product,
        storeId: store.id,
      })
      .returning({
        id: products.id,
        images: products.images,
      })
  );

  if (error) {
    return {
      data: null,
      error: "Unable to create new product",
    };
  }

  const imageConfirmationPromises = newProduct[0].images.map(async (url) => {
    const { success } = await esBackendClient.productImages.confirmUpload({
      url,
    });
    return success;
  });

  await tryCatch(Promise.all(imageConfirmationPromises));

  return {
    data: newProduct[0].id,
    error: null,
  };
}
