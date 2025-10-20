import axios from "axios";
import { Cashfree, CFEnvironment } from "cashfree-pg";

import { env } from "@/env";

export const cashfree = new Cashfree(
  CFEnvironment.SANDBOX,
  env.CF_CLIENT_ID,
  env.CF_CLIENT_SECRET,
);

export const api = axios.create({
  baseURL: "https://sandbox.cashfree.com/pg",
  headers: {
    "x-api-version": "2025-01-01",
    "x-client-id": env.CF_CLIENT_ID,
    "x-client-secret": env.CF_CLIENT_SECRET,
  },
});
