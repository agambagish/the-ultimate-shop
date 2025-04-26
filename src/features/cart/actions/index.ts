"use server";

import crypto from "crypto";

import { env } from "@/env";
import type { CheckoutSchema } from "@/features/cart/lib/checkout-schema";
import type { CheckoutWebhookSchema } from "@/features/cart/lib/checkout-webhook-schema";

/* eslint-disable require-await */

export async function generateCheckoutHash(
  payload: Pick<
    CheckoutSchema,
    | "key"
    | "txnid"
    | "amount"
    | "productinfo"
    | "firstname"
    | "email"
    | "udf1"
    | "udf2"
    | "udf3"
    | "udf4"
    | "udf5"
  >
) {
  const {
    key,
    txnid,
    amount,
    productinfo,
    firstname,
    email,
    udf1,
    udf2,
    udf3,
    udf4,
    udf5,
  } = payload;

  const hashString = `${key}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|${udf1}|${udf2}|${udf3}|${udf4}|${udf5}||||||${env.PAYU_SALT}`;

  const hash = crypto.createHash("sha512").update(hashString).digest("hex");

  return { hash };
}

export async function validateWebhookResponse(payload: CheckoutWebhookSchema) {
  const {
    key,
    txnid,
    amount,
    productinfo,
    firstname,
    email,
    udf1,
    udf2,
    udf3,
    udf4,
    udf5,
    status,
  } = payload;

  const hashString = `${env.PAYU_SALT}|${status}||||||${udf5}|${udf4}|${udf3}|${udf2}|${udf1}|${email}|${firstname}|${productinfo}|${amount}|${txnid}|${key}`;

  const calculatedHash = crypto
    .createHash("sha512")
    .update(hashString)
    .digest("hex");

  return calculatedHash === payload.hash;
}
