import { headers as getHeaders } from "next/headers";

import z from "zod";

import type { Prisma } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";

import { DEFAULT_LIMIT, sortValues } from "../lib/constants";

export const productsRouter = createTRPCRouter({
  getOne: baseProcedure
    .input(
      z.object({
        productId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const headers = await getHeaders();
      const session = await ctx.payload.auth({ headers });

      const product = await prisma.products.findUnique({
        where: { id: Number(input.productId) },
        select: {
          title: true,
          description: true,
          image_id: true,
          price: true,
          discount_type: true,
          discount_value: true,
          stores: {
            select: {
              name: true,
              avatar_id: true,
            },
          },
          categories: {
            select: {
              label: true,
              slug: true,
              categories: {
                select: {
                  label: true,
                  slug: true,
                },
              },
            },
          },
        },
      });

      if (!product) return null;

      let isPurchased = false;

      if (session.user) {
        const order = await prisma.orders.findFirst({
          where: {
            AND: [
              { product_id: Number(input.productId) },
              { user_id: session.user.id },
            ],
          },
          select: { id: true },
        });

        isPurchased = !!order;
      }

      const reviews = await prisma.reviews.findMany({
        where: { product_id: Number(input.productId) },
        select: { rating: true },
      });

      const reviewRating =
        reviews.length > 0
          ? Number(
              (
                reviews.reduce(
                  (acc, review) => acc + review.rating.toNumber(),
                  0,
                ) / reviews.length
              ).toFixed(1),
            )
          : 0;

      const ratingDistribution: Record<number, number> = {
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0,
      };

      if (reviews.length > 0) {
        reviews.forEach((review) => {
          const rating = review.rating.toNumber();

          if (rating >= 1 && rating <= 5) {
            ratingDistribution[rating] = (ratingDistribution[rating] || 0) + 1;
          }
        });

        Object.keys(ratingDistribution).forEach((key) => {
          const rating = Number(key);
          const count = ratingDistribution[rating] || 0;
          ratingDistribution[rating] = Math.round(
            (count / reviews.length) * 100,
          );
        });
      }

      return {
        ...product,
        price: Math.round(product.price.toNumber()),
        discount_value: Math.round(product.discount_value.toNumber()),
        isPurchased,
        reviewRating,
        reviewCount: reviews.length,
        ratingDistribution,
      };
    }),
  getMany: baseProcedure
    .input(
      z.object({
        cursor: z.number().default(1),
        limit: z.number().default(DEFAULT_LIMIT),
        category: z.string().nullable().optional(),
        sort: z.enum(sortValues).nullable().optional(),
        minPrice: z.string().nullable().optional(),
        maxPrice: z.string().nullable().optional(),
        tags: z.array(z.string()).nullable().optional(),
        storeSubdomain: z.string().nullable().optional(),
      }),
    )
    .query(async ({ input }) => {
      const where: Prisma.productsWhereInput = {};
      const orderBy: Prisma.productsOrderByWithRelationInput = {};

      switch (input.sort) {
        case "new":
          orderBy.created_at = "desc";
          break;
        case "lth":
          orderBy.price = "asc";
          break;
        case "htl":
          orderBy.price = "desc";
          break;
        default:
          orderBy.created_at = "desc";
          break;
      }

      if (input.minPrice && input.maxPrice) {
        where.price = {
          gte: input.minPrice,
          lte: input.maxPrice,
        };
      } else if (input.minPrice) {
        where.price = {
          gte: input.minPrice,
        };
      } else if (input.maxPrice) {
        where.price = {
          lte: input.maxPrice,
        };
      }

      if (input.storeSubdomain) {
        const tenant = await prisma.stores.findUnique({
          where: { subdomain: input.storeSubdomain },
          select: { id: true },
        });

        where.tenant_id = tenant?.id;
      }

      if (input.category) {
        const category = await prisma.categories.findUnique({
          where: { slug: input.category },
          select: {
            slug: true,
            other_categories: {
              select: {
                slug: true,
              },
            },
          },
        });

        const subcategorySlugs = [];

        if (category) {
          subcategorySlugs.push(
            ...category.other_categories.map((subcategory) => subcategory.slug),
          );

          where.categories = {
            slug: { in: [category.slug, ...subcategorySlugs] },
          };
        }
      }

      if (input.tags && input.tags.length > 0) {
        where.OR = [
          { products_rels: { some: { tags: { label: { in: input.tags } } } } },
          { tags_rels: { some: { tags: { label: { in: input.tags } } } } },
        ];
      }

      const skip = (input.cursor - 1) * input.limit;

      const [totalProducts, products] = await Promise.all([
        prisma.products.count({ where }),
        prisma.products.findMany({
          where,
          skip,
          take: input.limit,
          orderBy,
          select: {
            id: true,
            title: true,
            price: true,
            discount_type: true,
            discount_value: true,
            image_id: true,
            stores: {
              select: {
                name: true,
                subdomain: true,
                avatar_id: true,
              },
            },
          },
        }),
      ]);

      const productsWithReviews = await Promise.all(
        products.map(async (product) => {
          const reviews = await prisma.reviews.findMany({
            where: { product_id: product.id },
          });

          return {
            ...product,
            reviewCount: reviews.length,
            reviewRating:
              reviews.length === 0
                ? 0
                : Number(
                    (
                      reviews.reduce(
                        (acc, review) => acc + review.rating.toNumber(),
                        0,
                      ) / reviews.length
                    ).toFixed(1),
                  ),
          };
        }),
      );

      const totalPages = Math.ceil(totalProducts / input.limit);

      return {
        products: productsWithReviews.map((product) => ({
          ...product,
          price: Math.round(product.price.toNumber()),
          discount_value: Math.round(product.discount_value.toNumber()),
        })),
        totalProducts,
        limit: input.limit,
        totalPages,
        page: input.cursor,
        pagingCounter: skip + 1,
        hasPrevPage: input.cursor > 1,
        hasNextPage: input.cursor < totalPages,
        prevPage: input.cursor > 1 ? input.cursor - 1 : null,
        nextPage: input.cursor < totalPages ? input.cursor + 1 : null,
      };
    }),
});
