import { authRouter } from "@/modules/auth/server/procedures";
import { categoriesRouter } from "@/modules/categories/server/procedures";

import { createTRPCRouter } from "../init";

export const appRouter = createTRPCRouter({
  categories: categoriesRouter,
  auth: authRouter,
});

export type AppRouter = typeof appRouter;
