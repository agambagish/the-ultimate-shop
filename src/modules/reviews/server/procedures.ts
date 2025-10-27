import { TRPCError } from "@trpc/server";
import z from "zod";

import { prisma } from "@/lib/prisma";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

export const reviewsRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const review = await prisma.reviews.findFirst({
        where: {
          AND: [
            { product_id: Number(input.productId) },
            { user_id: ctx.session.user.id },
          ],
        },
        select: {
          id: true,
          rating: true,
          description: true,
        },
      });

      if (!review) return null;

      return {
        ...review,
        rating: review.rating.toNumber(),
      };
    }),
  create: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
        rating: z.number().min(1).max(5),
        description: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const product = await prisma.products.findUnique({
        where: { id: Number(input.productId) },
        select: { id: true },
      });

      if (!product) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found",
        });
      }

      const existingReview = await prisma.reviews.findFirst({
        where: {
          AND: [{ product_id: product.id }, { user_id: ctx.session.user.id }],
        },
        select: { id: true },
      });

      if (existingReview) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "You have already reviewed this product",
        });
      }

      const review = await prisma.reviews.create({
        data: {
          user_id: ctx.session.user.id,
          product_id: product.id,
          ...input,
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
      const existingReview = await prisma.reviews.findUnique({
        where: { id: Number(input.reviewId) },
        select: { user_id: true },
      });

      if (!existingReview) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Review not found",
        });
      }

      if (existingReview.user_id !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not allowed to update this review",
        });
      }

      const updatedReview = await prisma.reviews.update({
        where: { id: Number(input.reviewId) },
        data: {
          rating: input.rating,
          description: input.description,
        },
      });

      return updatedReview;
    }),
});
