import z from "zod";

import { prisma } from "@/lib/prisma";
import { DEFAULT_LIMIT } from "@/modules/products/lib/constants";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

export const libraryRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const product = await prisma.products.findUnique({
        where: { id: Number(input.productId) },
        select: {
          id: true,
          content: true,
        },
      });

      if (!product) return null;

      const order = await prisma.orders.findFirst({
        where: {
          AND: [{ product_id: product.id }, { user_id: ctx.session.user.id }],
        },
        select: {
          id: true,
          created_at: true,
          price: true,
          discounted_price: true,
        },
      });

      if (!order) return null;

      const { paymentDetails } = await ctx.payload.findByID({
        collection: "orders",
        id: order.id,
        select: { paymentDetails: true },
      });

      return {
        product,
        order: {
          ...order,
          price: order.price.toNumber(),
          discounted_price: order.discounted_price.toNumber(),
          paymentDetails,
        },
      };
    }),
  getMany: protectedProcedure
    .input(
      z.object({
        cursor: z.number().default(1),
        limit: z.number().default(DEFAULT_LIMIT),
      }),
    )
    .query(async ({ ctx, input }) => {
      const orders = await prisma.orders.findMany({
        where: { user_id: ctx.session.user.id },
        select: { product_id: true },
      });

      const productIds = orders.map((order) => order.product_id);
      const skip = (input.cursor - 1) * input.limit;
      const where = { id: { in: productIds } };

      const [totalProducts, products] = await Promise.all([
        prisma.products.count({ where }),
        prisma.products.findMany({
          where,
          skip,
          take: input.limit,
          select: {
            id: true,
            title: true,
            image_id: true,
            stores: {
              select: {
                name: true,
                avatar_id: true,
              },
            },
          },
        }),
      ]);

      const totalPages = Math.ceil(totalProducts / input.limit);

      return {
        products,
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
