import { cache } from "react";

import config from "@payload-config";
import { initTRPC } from "@trpc/server";
import { getPayload } from "payload";
import superjson from "superjson";

// biome-ignore lint/suspicious/useAwait: _
export const createTRPCContext = cache(async () => {
  return { userId: "user_123" };
});

const t = initTRPC.create({
  transformer: superjson,
});

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure.use(async ({ next }) => {
  const payload = await getPayload({
    config,
  });

  return next({ ctx: { payload } });
});
