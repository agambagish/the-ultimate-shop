import { z } from "zod/v4";

import { hashParamSchema } from "./hash-param-schema";

export const billingAddressSchema = hashParamSchema
  .omit({
    amount: true,
    furl: true,
    key: true,
    phone: true,
    productinfo: true,
    surl: true,
    txnid: true,
    udf1: true,
    udf2: true,
    udf3: true,
    udf4: true,
    udf5: true,
  })
  .extend({
    firstname: z.string().min(2, { message: "At least 2 characters required" }),
    lastname: z.string().min(2, { message: "At least 2 characters required" }),
    email: z.string().email({ message: "Must be valid email" }),
    address: z.string().min(5, { message: "At least 5 characters required" }),
    city: z.string().min(2, { message: "At least 2 characters required" }),
    state: z.string().min(2, { message: "At least 2 characters required" }),
    pinCode: z.string().min(4, { message: "At least 4 characters required" }),
    country: z.string().min(2, { message: "At least 2 characters required" }),
  });

export type BillingAddressSchema = z.infer<typeof billingAddressSchema>;
