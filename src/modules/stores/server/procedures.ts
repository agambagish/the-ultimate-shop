import { TRPCError } from "@trpc/server";
import z from "zod";

import type { Media, Store } from "@/payload-types";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";

export const storesRouter = createTRPCRouter({
  getOne: baseProcedure
    .input(
      z.object({
        subdomain: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const storesData = await ctx.payload.find({
        collection: "stores",
        depth: 1,
        where: {
          subdomain: {
            equals: input.subdomain,
          },
        },
        limit: 1,
        pagination: false,
      });

      const store = storesData.docs[0];

      if (!store) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Store not found",
        });
      }

      return store as Store & { avatar: Media | null };
    }),
});
