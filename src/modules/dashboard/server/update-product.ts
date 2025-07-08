"use server";

import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { products } from "@/db/schema";
import { tryCatch } from "@/lib/try-catch";

import type { UpdateProductSchema } from "../schemas/update-product-schema";

interface Values
  extends Omit<
    UpdateProductSchema,
    | "thumbnailImage"
    | "image1"
    | "image2"
    | "image3"
    | "image4"
    | "image5"
    | "productAsset"
  > {
  thumbnailImageURL: string | undefined;
  imageURL1: string | undefined;
  imageURL2: string | undefined;
  imageURL3: string | undefined;
  imageURL4: string | undefined;
  imageURL5: string | undefined;
  //  productAsset: File;
}

interface Props {
  slug: string;
  values: Values;
}

export async function updateProduct({ slug, values }: Props) {
  const { userId } = await auth();
  if (!userId) throw new Error("You are not signed in");

  const store = await tryCatch(
    db.query.stores.findFirst({
      where: (stores, { and, eq }) =>
        and(eq(stores.userId, userId), eq(stores.status, "active")),
      columns: { id: true },
    })
  );

  if (store.error || !store.data?.id)
    throw new Error("Your store is deactivated");

  const updatedProduct = await tryCatch(
    db
      .update(products)
      .set({
        ...values,
        productCategoryId: !!values.productCategoryId
          ? Number(values.productCategoryId)
          : undefined,
      })
      .where(eq(products.slug, slug))
      .returning({ id: products.id })
  );

  if (updatedProduct.error || updatedProduct.data.length === 0)
    throw new Error("Failed to update product");

  return updatedProduct.data[0].id;
}
