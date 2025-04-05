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
import { categories, products } from "@/db/schema";
import type { productsTableParams } from "@/features/data-table/lib/products-table-params";
import { unstable_cache } from "@/lib/unstable-cache";

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

export async function getCategories() {
  return await unstable_cache(
    async () => {
      try {
        const data = await db
          .select({
            id: categories.id,
            label: categories.label,
            slug: categories.slug,
          })
          .from(categories)
          .orderBy(asc(categories.id));

        return { categories: data };
      } catch {
        return { categories: [] };
      }
    },
    ["categories"],
    {
      revalidate: 1,
    }
  )();
}
