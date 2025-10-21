import { prisma } from "@/lib/prisma";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";

export const categoriesRouter = createTRPCRouter({
  getMany: baseProcedure.query(async () => {
    const data = await prisma.categories.findMany({
      where: { parent_id: null },
      select: {
        id: true,
        label: true,
        slug: true,
        other_categories: {
          select: {
            id: true,
            label: true,
            slug: true,
          },
        },
      },
      orderBy: { label: "asc" },
    });

    return data;
  }),
});
