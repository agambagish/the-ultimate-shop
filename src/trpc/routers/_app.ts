import { authRouter } from "@/modules/auth/server/procedures";
import { categoriesRouter } from "@/modules/categories/server/procedures";
import { checkoutRouter } from "@/modules/checkout/server/procedures";
import { libraryRouter } from "@/modules/library/server/procedures";
import { productsRouter } from "@/modules/products/server/procedures";
import { storesRouter } from "@/modules/stores/server/procedures";
import { tagsRouter } from "@/modules/tags/server/procedures";

import { createTRPCRouter } from "../init";

export const appRouter = createTRPCRouter({
  categories: categoriesRouter,
  auth: authRouter,
  products: productsRouter,
  tags: tagsRouter,
  stores: storesRouter,
  checkout: checkoutRouter,
  library: libraryRouter,
});

export type AppRouter = typeof appRouter;
