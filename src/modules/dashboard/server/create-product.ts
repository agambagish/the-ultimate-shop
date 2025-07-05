"use server";

import { auth } from "@clerk/nextjs/server";
import mime from "mime-types";

import { db } from "@/db";
import { products, productsAssets } from "@/db/schema";
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
    | "productAsset"
  > & {
    thumbnailImageURL: string;
    imageURL1: string;
    imageURL2: string;
    imageURL3: string;
    imageURL4: string;
    imageURL5: string;
    productAsset: File;
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

  const extension = mime.extension(values.productAsset.type).toString();
  const upload = await pinata.upload.private
    .file(values.productAsset)
    .name(`${crypto.randomUUID()}.${extension}`);

  const data = await db.transaction(async (tx) => {
    const productAsset = await tryCatch(
      tx
        .insert(productsAssets)
        .values({
          pinataId: upload.id,
          pinataCID: upload.cid,
          fileName: upload.name,
          mimeType: upload.mime_type,
          size: upload.size,
          productSlug: values.slug,
        })
        .returning({
          id: productsAssets.id,
        })
    );

    if (productAsset.error) {
      throw new Error("Something went wrong");
    }

    const product = await tryCatch(
      tx
        .insert(products)
        .values({
          ...values,
          productAssetId: productAsset.data[0].id,
          productCategoryId: Number(values.productCategoryId),
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
