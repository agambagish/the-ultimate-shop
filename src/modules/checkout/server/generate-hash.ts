"use server";

import crypto from "crypto";

import { env } from "@/env";

import {
  type HashParamSchema,
  hashParamSchema,
} from "../schemas/hash-param-schema";

export async function generateHash(params: HashParamSchema) {
  const { data, error } = hashParamSchema.safeParse(params);

  if (error) {
    throw new Error("Unprocessable Entity");
  }

  const hashString = `${data.key}|${data.txnid}|${data.amount}|${data.productinfo}|${data.firstname}|${data.email}|${data.udf1}|${data.udf2}|${data.udf3}|${data.udf4}|${data.udf5}||||||${env.PAYU_SALT}`;

  return await Promise.resolve(
    crypto.createHash("sha512").update(hashString).digest("hex")
  );
}
