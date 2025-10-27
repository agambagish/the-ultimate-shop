import z from "zod";

import { prisma } from "@/lib/prisma";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";

import { DEFAULT_LIMIT } from "../lib/constants";

export const tagsRouter = createTRPCRouter({
  getMany: baseProcedure
    .input(
      z.object({
        cursor: z.number().default(1),
        limit: z.number().default(DEFAULT_LIMIT),
      }),
    )
    .query(async ({ input }) => {
      const skip = (input.cursor - 1) * input.limit;
      const [totalTags, tags] = await Promise.all([
        prisma.tags.count(),
        prisma.tags.findMany({
          skip,
          take: input.limit,
          select: {
            id: true,
            label: true,
          },
        }),
      ]);

      const totalPages = Math.ceil(totalTags / input.limit);

      return {
        tags,
        totalTags,
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
