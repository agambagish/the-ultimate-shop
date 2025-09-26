import { cookies as nextCookies, headers as nextHeaders } from "next/headers";

import { TRPCError } from "@trpc/server";

import { baseProcedure, createTRPCRouter } from "@/trpc/init";

import { AUTH_COOKIE_NAME } from "../lib/constants";
import { loginSchema, registerSchema } from "../lib/schemas";

export const authRouter = createTRPCRouter({
  session: baseProcedure.query(async ({ ctx }) => {
    const headers = await nextHeaders();
    const session = await ctx.payload.auth({ headers });

    return session;
  }),
  register: baseProcedure
    .input(registerSchema)
    .mutation(async ({ input, ctx }) => {
      const existingData = await ctx.payload.find({
        collection: "users",
        limit: 1,
        where: {
          subdomain: {
            equals: input.subdomain,
          },
        },
      });

      if (existingData.totalDocs === 1) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Subdomain already taken",
        });
      }

      await ctx.payload.create({
        collection: "users",
        data: {
          email: input.email,
          password: input.password,
          subdomain: input.subdomain,
        },
      });

      const data = await ctx.payload.login({
        collection: "users",
        data: {
          email: input.email,
          password: input.password,
        },
      });

      if (!data.token) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Failed to login",
        });
      }

      const cookies = await nextCookies();

      cookies.set({
        name: AUTH_COOKIE_NAME,
        value: data.token,
        httpOnly: true,
        path: "/",
      });
    }),
  login: baseProcedure.input(loginSchema).mutation(async ({ input, ctx }) => {
    const data = await ctx.payload.login({
      collection: "users",
      data: {
        email: input.email,
        password: input.password,
      },
    });

    if (!data.token) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Failed to login",
      });
    }

    const cookies = await nextCookies();

    cookies.set({
      name: AUTH_COOKIE_NAME,
      value: data.token,
      httpOnly: true,
      path: "/",
    });

    return data;
  }),
  logout: baseProcedure.mutation(async () => {
    const cookies = await nextCookies();
    cookies.delete(AUTH_COOKIE_NAME);
  }),
});
