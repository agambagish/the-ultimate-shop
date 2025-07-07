"use server";

import { auth } from "@clerk/nextjs/server";
import mime from "mime-types";

import { db } from "@/db";
import { products, productsAssets } from "@/db/schema";
import { pinata } from "@/lib/pinata";
import { tryCatch } from "@/lib/try-catch";

import type { CreateProductSchema } from "../schemas/create-product-schema";

interface Props
  extends Omit<
    CreateProductSchema,
    | "thumbnailImage"
    | "image1"
    | "image2"
    | "image3"
    | "image4"
    | "image5"
    | "productAsset"
  > {
  thumbnailImageURL: string;
  imageURL1: string;
  imageURL2: string;
  imageURL3?: string;
  imageURL4?: string;
  imageURL5?: string;
  productAsset: File;
}

export async function createProduct(values: Props) {
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

  const extension = mime.extension(values.productAsset.type).toString();
  if (!extension) throw new Error("Unable to detect file extension");

  const upload = await pinata.upload.private
    .file(values.productAsset)
    .name(`${crypto.randomUUID()}.${extension}`);

  const productAsset = await tryCatch(
    db
      .insert(productsAssets)
      .values({
        pinataId: upload.id,
        pinataCID: upload.cid,
        fileName: upload.name,
        mimeType: upload.mime_type,
        size: upload.size,
        productSlug: values.slug,
      })
      .returning({ id: productsAssets.id })
  );

  if (productAsset.error || productAsset.data.length === 0)
    throw new Error("Failed to store product asset");

  const product = await tryCatch(
    db
      .insert(products)
      .values({
        ...values,
        productAssetId: productAsset.data[0].id,
        productCategoryId: Number(values.productCategoryId),
        storeId: store.data.id,
      })
      .returning({ id: products.id })
  );

  if (product.error || product.data.length === 0)
    throw new Error("Failed to create product");

  return product.data[0].id;
}
