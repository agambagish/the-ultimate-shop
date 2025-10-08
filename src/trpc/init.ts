import { cache } from "react";
import { headers as getHeaders } from "next/headers";

import config from "@payload-config";
import { initTRPC, TRPCError } from "@trpc/server";
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

export const protectedProcedure = baseProcedure.use(async ({ ctx, next }) => {
  const headers = await getHeaders();
  const session = await ctx.payload.auth({ headers });

  if (!session.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Not logged in",
    });
  }

  return next({
    ctx: {
      ...ctx,
      session: {
        ...session,
        user: session.user,
      },
    },
  });
});
