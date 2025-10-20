import { TRPCError } from "@trpc/server";
import z from "zod";

import { DEFAULT_LIMIT } from "@/modules/products/lib/constants";
import type { Media, Store } from "@/payload-types";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

export const libraryRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(
      z.object({
        orderId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const order = await ctx.payload
        .find({
          collection: "orders",
          limit: 1,
          pagination: false,
          depth: 0,
          where: {
            and: [
              { id: { equals: input.orderId } },
              { user: { equals: ctx.session.user.id } },
            ],
          },
        })
        .then(({ docs }) => docs[0]);

      if (!order) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Order not found",
        });
      }

      const product = await ctx.payload.findByID({
        collection: "products",
        id: order.product as number,
      });

      if (!product) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found",
        });
      }

      return {
        ...product,
        orderId: order.id,
        placedOn: order.createdAt,
        paymentDetails: order.paymentDetails,
        purchasedPrice: order.price,
        purchasedDiscountedPrice: order.discountedPrice,
        purchasedDiscountPercentage:
          order.discountedPrice === order.price
            ? 0
            : Math.round(
                ((order.price - order.discountedPrice) / order.price) * 100,
              ),
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
      const ordersData = await ctx.payload.find({
        collection: "orders",
        depth: 0,
        page: input.cursor,
        limit: input.limit,
        where: {
          user: { equals: ctx.session.user.id },
        },
      });

      if (!ordersData.docs.length) {
        return {
          ...ordersData,
          totalSpent: 0,
          docs: [],
        };
      }

      const productIds = ordersData.docs.map((order) => order.product);

      const productsData = await ctx.payload.find({
        collection: "products",
        select: { content: false },
        pagination: false,
        where: {
          id: { in: productIds },
        },
      });

      const productMap = new Map(productsData.docs.map((p) => [p.id, p]));

      const mergedDocs = ordersData.docs.map((order) => {
        const product = productMap.get(order.product as number);

        return {
          ...order,
          product: product
            ? {
                ...product,
                image: product.image as Media | null,
                tenant: product.tenant as Store & { avatar: Media | null },
              }
            : null,
        };
      });

      return {
        ...ordersData,
        docs: mergedDocs,
        totalSpent: ordersData.docs.reduce(
          (acc, order) => acc + order.discountedPrice,
          0,
        ),
      };
    }),
});
