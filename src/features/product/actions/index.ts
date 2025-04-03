"use server";

import { revalidateTag, unstable_noStore } from "next/cache";

import { auth } from "@clerk/nextjs/server";
import { inArray } from "drizzle-orm";
import mime from "mime-types";

import { db } from "@/db";
import type { productStatusEnum } from "@/db/schema";
import { products } from "@/db/schema";
import type { CreateProductSchema } from "@/features/product/lib/create-product-schema";
import type { UpdateProductSchema } from "@/features/product/lib/update-product-schema";
import { esBackendClient } from "@/lib/edgestore-server";
import { tryCatch } from "@/lib/try-catch";
import { getUpdatedValues } from "@/lib/utils";

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

  revalidateTag("products");
  revalidateTag("product-status-counts");

  return {
    data: newProduct[0].id,
    error: null,
  };
}

export async function updateProductStatus({
  productIds,
  status,
}: {
  productIds: number[];
  status: (typeof productStatusEnum.enumValues)[number];
}) {
  unstable_noStore();

  const { data, error } = await tryCatch(
    db
      .update(products)
      .set({
        status,
      })
      .where(inArray(products.id, productIds))
      .returning({ id: products.id })
  );

  if (error) {
    return {
      data: null,
      error: "Unable to update product(s)",
    };
  }

  revalidateTag("products");
  revalidateTag("product-status-counts");

  return {
    data: data[0].id,
    error: null,
  };
}

export async function deleteProducts({ productIds }: { productIds: number[] }) {
  unstable_noStore();
  const { error } = await tryCatch(
    db.delete(products).where(inArray(products.id, productIds))
  );

  if (error) {
    return {
      data: null,
      error: "Unable to delete product(s)",
    };
  }

  revalidateTag("products");
  revalidateTag("product-status-counts");

  return {
    data: null,
    error: null,
  };
}

export async function updateProduct({
  productId,
  payload,
  dirtyFields,
}: {
  productId: number;
  payload: UpdateProductSchema;
  dirtyFields: Partial<Record<keyof UpdateProductSchema, boolean>>;
}) {
  const { data: product, error: productFetchingError } = await tryCatch(
    db.query.products.findFirst({
      where: (f, o) => o.eq(f.id, productId),
      columns: { images: true },
    })
  );

  if (productFetchingError || !product) {
    return {
      data: null,
      error: "Store doesn't exist",
    };
  }

  const updatedValues = getUpdatedValues(payload, dirtyFields);

  const updatedImagesIndexes =
    updatedValues.images
      ?.map((value, index) => ({ value, index }))
      .filter(
        (image) => image.value.size !== 0 && image.value.type !== "text/plain"
      )
      .map((i) => i.index) ?? [];

  const imgReplacePromises =
    updatedValues.images
      ?.filter((image) => image.size !== 0 && image.type !== "text/plain")
      .map(async (file, i) => {
        const { url } = await esBackendClient.productImages.upload({
          content: {
            blob: file,
            extension: mime.extension(file.type) || "png",
          },
          options: {
            replaceTargetUrl: product.images[updatedImagesIndexes[i]],
          },
        });
        return url;
      }) ?? [];

  const { data: replacedImages, error: imgReplaceError } = await tryCatch(
    Promise.all(imgReplacePromises)
  );

  if (imgReplaceError) {
    return {
      data: null,
      error: "Unable to update image(s)",
    };
  }

  const { data, error } = await tryCatch(
    db
      .update(products)
      .set({
        ...updatedValues,
        images: [
          ...product.images.filter((_, i) => !updatedImagesIndexes.includes(i)),
          ...replacedImages,
        ],
      })
      .returning({
        id: products.id,
      })
  );

  if (error) {
    return {
      data: null,
      error: "Unable to update product",
    };
  }

  revalidateTag("products");
  revalidateTag("product-status-counts");

  return {
    data: data[0].id,
    error: null,
  };
}
