import { Cashfree, CFEnvironment } from "cashfree-pg";

import { env } from "@/env";

export const cashfree = new Cashfree(
  CFEnvironment.SANDBOX,
  env.CF_CLIENT_ID,
  env.CF_CLIENT_SECRET,
);
