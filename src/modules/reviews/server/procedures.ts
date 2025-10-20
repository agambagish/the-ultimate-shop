import { TRPCError } from "@trpc/server";
import z from "zod";

import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

export const reviewsRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(
      z.object({
        orderId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const order = await ctx.payload.findByID({
        collection: "orders",
        id: input.orderId,
      });

      if (!order) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Order not found",
        });
      }

      const review = await ctx.payload
        .find({
          collection: "reviews",
          limit: 1,
          where: {
            and: [
              { order: { equals: order.id } },
              { user: { equals: ctx.session.user.id } },
            ],
          },
        })
        .then(({ docs }) => docs[0]);

      if (!review) return null;

      return review;
    }),
  create: protectedProcedure
    .input(
      z.object({
        orderId: z.string(),
        rating: z.number().min(1).max(5),
        description: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const order = await ctx.payload.findByID({
        collection: "orders",
        id: input.orderId,
        depth: 0,
      });

      if (!order) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Order not found",
        });
      }

      const product = await ctx.payload.findByID({
        collection: "products",
        select: { content: false },
        id: order.product as number,
      });

      if (!product) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found",
        });
      }

      const existingReviewsData = await ctx.payload.find({
        collection: "reviews",
        where: {
          and: [
            { product: { equals: order.product } },
            { user: { equals: ctx.session.user.id } },
          ],
        },
      });

      if (existingReviewsData.totalDocs > 0) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "You have already reviewed this product",
        });
      }

      const review = await ctx.payload.create({
        collection: "reviews",
        data: {
          user: ctx.session.user.id,
          product: product.id,
          rating: input.rating,
          description: input.description,
          order: order.id,
        },
      });

      return review;
    }),
  update: protectedProcedure
    .input(
      z.object({
        reviewId: z.string(),
        rating: z.number().min(1).max(5),
        description: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const existingReview = await ctx.payload.findByID({
        depth: 0,
        collection: "reviews",
        id: input.reviewId,
      });

      if (!existingReview) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Review not found",
        });
      }

      if (existingReview.user !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not allowed to update this review",
        });
      }

      const updatedReview = await ctx.payload.update({
        collection: "reviews",
        id: input.reviewId,
        data: {
          rating: input.rating,
          description: input.description,
        },
      });

      return updatedReview;
    }),
});
