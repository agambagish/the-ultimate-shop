"use server";

import { revalidateTag, unstable_noStore } from "next/cache";

import { auth } from "@clerk/nextjs/server";
import {
  and,
  asc,
  count,
  desc,
  gt,
  gte,
  ilike,
  inArray,
  lte,
} from "drizzle-orm";

import { db } from "@/db";
import type { productStatusEnum } from "@/db/schema";
import { products } from "@/db/schema";
import type { CreateProductSchema } from "@/features/dashboard/lib/create-product-schema";
import type { productsTableParams } from "@/features/data-table/lib/products-table-params";
import { esBackendClient } from "@/lib/edgestore-server";
import { tryCatch } from "@/lib/try-catch";
import { unstable_cache } from "@/lib/unstable-cache";

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

export async function getProducts(
  payload: Awaited<ReturnType<typeof productsTableParams.parse>>
) {
  return await unstable_cache(
    async () => {
      try {
        const offset = (payload.page - 1) * payload.perPage;

        const where = and(
          payload.title
            ? ilike(products.title, `%${payload.title}%`)
            : undefined,
          payload.status.length > 0
            ? inArray(products.status, payload.status)
            : undefined,
          payload.createdAt.length > 0
            ? and(
                payload.createdAt[0]
                  ? gte(
                      products.createdAt,
                      (() => {
                        const date = new Date(payload.createdAt[0]);
                        date.setHours(0, 0, 0, 0);
                        return date;
                      })()
                    )
                  : undefined,
                payload.createdAt[1]
                  ? lte(
                      products.createdAt,
                      (() => {
                        const date = new Date(payload.createdAt[1]);
                        date.setHours(23, 59, 59, 999);
                        return date;
                      })()
                    )
                  : undefined
              )
            : undefined
        );

        const orderBy =
          payload.sort.length > 0
            ? payload.sort.map((item) =>
                item.desc ? desc(products[item.id]) : asc(products[item.id])
              )
            : [asc(products.createdAt)];

        const { data, total } = await db.transaction(async (tx) => {
          const data = await tx
            .select()
            .from(products)
            .limit(payload.perPage)
            .offset(offset)
            .where(where)
            .orderBy(...orderBy);

          const total = await tx
            .select({
              count: count(),
            })
            .from(products)
            .where(where)
            .execute()
            .then((res) => res[0].count ?? 0);

          return {
            data,
            total,
          };
        });

        const pageCount = Math.ceil(total / payload.perPage);
        return {
          data,
          pageCount,
        };
      } catch {
        return {
          data: [],
          pageCount: 0,
        };
      }
    },
    [JSON.stringify(payload)],
    {
      revalidate: 1,
      tags: ["products"],
    }
  )();
}

export async function getProductStatusCounts() {
  return await unstable_cache(
    async () => {
      try {
        return await db
          .select({
            status: products.status,
            count: count(),
          })
          .from(products)
          .groupBy(products.status)
          .having(gt(count(products.status), 0))
          .then((res) =>
            res.reduce(
              (acc, { status, count }) => {
                acc[status] = count;
                return acc;
              },
              {
                active: 0,
                draft: 0,
                archived: 0,
              }
            )
          );
      } catch {
        return {
          active: 0,
          draft: 0,
          archived: 0,
        };
      }
    },
    ["product-status-counts"],
    {
      revalidate: 3600,
    }
  )();
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
