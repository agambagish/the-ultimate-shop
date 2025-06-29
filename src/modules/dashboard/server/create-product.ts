"use server";

import { auth } from "@clerk/nextjs/server";
import mime from "mime-types";

import { db } from "@/db";
import { products, productsFiles } from "@/db/schema";
import { pinata } from "@/lib/pinata";
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
    productFile: File;
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

  const extension = mime.extension(values.productFile.type).toString();
  const upload = await pinata.upload.private
    .file(values.productFile)
    .name(`${crypto.randomUUID()}.${extension}`);

  const data = await db.transaction(async (tx) => {
    const productFile = await tryCatch(
      tx
        .insert(productsFiles)
        .values({
          pinataId: upload.id,
          fileName: upload.name,
          mimeType: upload.mime_type,
          size: upload.size,
          productSlug: values.slug,
        })
        .returning({
          id: productsFiles.id,
        })
    );

    if (productFile.error) {
      throw new Error("Something went wrong");
    }

    const product = await tryCatch(
      tx
        .insert(products)
        .values({
          ...values,
          productFileId: productFile.data[0].id,
          storeId: store.id,
        })
        .returning({
          title: products.title,
        })
    );

    if (product.error) {
      throw new Error("Something went wrong");
    }

    return product.data[0].title;
  });

  return { data };
}
