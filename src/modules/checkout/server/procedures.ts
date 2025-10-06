import { TRPCError } from "@trpc/server";
import z from "zod";

import type { Media, Store } from "@/payload-types";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";

export const checkoutRouter = createTRPCRouter({
  getProducts: baseProcedure
    .input(
      z.object({
        productIds: z.array(z.string()),
      }),
    )
    .query(async ({ ctx, input }) => {
      const data = await ctx.payload.find({
        collection: "products",
        depth: 2,
        where: {
          id: { in: input.productIds },
        },
      });

      if (data.totalDocs !== input.productIds.length) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Products not found",
        });
      }

      return {
        ...data,
        subtotal: data.docs.reduce((acc, product) => acc + product.price, 0),
        docs: data.docs.map((doc) => ({
          ...doc,
          image: doc.image as Media | null,
          tenant: doc.tenant as Store & { avatar: Media | null },
        })),
      };
    }),
});
