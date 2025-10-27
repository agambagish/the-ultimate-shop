import z from "zod";

import { prisma } from "@/lib/prisma";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";

export const storesRouter = createTRPCRouter({
  getOne: baseProcedure
    .input(
      z.object({
        subdomain: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const store = await prisma.stores.findUnique({
        where: { subdomain: input.subdomain },
        select: {
          name: true,
          avatar_id: true,
        },
      });

      if (!store) return null;

      return store;
    }),
});
