import type { inferRouterOutputs } from "@trpc/server";

import type { AppRouter } from "@/trpc/routers/_app";

// biome-ignore lint/suspicious/noExplicitAny: _
export type StrictDefined<T> = T extends (...args: any) => any
  ? T
  : T extends object
    ? { [K in keyof T]-?: StrictDefined<NonNullable<T[K]>> }
    : NonNullable<T>;

type TRouterOutputs = inferRouterOutputs<AppRouter>;

type TQueryPaths = {
  [R in keyof TRouterOutputs & string]: {
    [P in keyof TRouterOutputs[R] & string]: `${R}.${P}`;
  }[keyof TRouterOutputs[R] & string];
}[keyof TRouterOutputs & string];

export type TQueryResult<Path extends TQueryPaths> =
  Path extends `${infer Router}.${infer Procedure}`
    ? TRouterOutputs[Router & keyof TRouterOutputs][Procedure &
        keyof TRouterOutputs[Router & keyof TRouterOutputs]]
    : never;
