import type { inferRouterOutputs } from "@trpc/server";

import type { AppRouter } from "@/trpc/routers/_app";

export type PaymentDetails =
  inferRouterOutputs<AppRouter>["library"]["getOne"]["paymentDetails"];
