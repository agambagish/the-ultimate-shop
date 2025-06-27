"use server";

import { auth } from "@clerk/nextjs/server";

import { db } from "@/db";
import { products } from "@/db/schema";
import { tryCatch } from "@/lib/try-catch";

import type { CreateProductSchema } from "../schemas/create-product-schema";

export async function createProduct(
  values: Omit<
    CreateProductSchema,
    | "thumbnailImage"
    | "image1"
    | "image2"
    | "image3"
    | "image4"
    | "image5"
    | "productFile"
  > & {
    thumbnailImageURL: string;
    imageURL1: string;
    imageURL2: string;
    imageURL3: string;
    imageURL4: string;
    imageURL5: string;
    productFileId: number;
  }
) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("You are not signed in");
  }

  const { data: store, error: storeErr } = await tryCatch(
    db.query.stores.findFirst({
      where: (f, o) => o.and(o.eq(f.userId, userId), o.eq(f.status, "active")),
      columns: { id: true },
    })
  );

  if (storeErr || !store?.id) {
    throw new Error("Your store is deactivated");
  }

  const { data, error } = await tryCatch(
    db
      .insert(products)
      .values({
        ...values,
        storeId: store.id,
      })
      .returning({
        title: products.title,
      })
  );

  if (error) {
    throw new Error("Something went wrong");
  }

  return {
    data: data[0].title,
  };
}
