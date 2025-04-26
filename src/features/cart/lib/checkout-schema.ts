import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

import { orders } from "@/db/schema";

export const checkoutSchema = createInsertSchema(orders, {
  vpa: (f) => f.regex(/^[\w.-]+@[\w.-]+$/, { message: "Enter a valid vpa" }),
})
  .omit({
    amount: true,
    email: true,
    name: true,
    items: true,
    payuTransactionId: true,
    deliveryAddress: true,
    payer: true,
    transactionId: true,
    userId: true,
  })
  .extend({
    key: z.string(),
    txnid: z.string().min(3),
    amount: z.number().gte(1),
    productinfo: z.string().min(3),
    firstname: z.string().min(1),
    lastname: z.string().min(1),
    surl: z.string().url(),
    furl: z.string().url(),
    email: z.string().email(),
    pg: z.enum(["UPI"]),
    bankcode: z.enum(["UPI"]),
    phone: z.number(),
    hash: z.string(),
    udf1: z.string(),
    udf2: z.string(),
    udf3: z.string(),
    udf4: z.string(),
    udf5: z.string(),
    address1: z
      .string()
      .min(3, { message: "Address Line 1 must be at least 3 characters" })
      .regex(/^[a-zA-Z0-9\s',]+$/, {
        message:
          "Only letters, numbers, spaces, commas, and apostrophes are allowed",
      }),
    address2: z
      .string()
      .min(3, { message: "Address Line 2 must be at least 3 characters" })
      .regex(/^[a-zA-Z0-9\s',]+$/, {
        message:
          "Only letters, numbers, spaces, commas, and apostrophes are allowed",
      }),
    city: z
      .string()
      .min(1, { message: "City is required" })
      .regex(/^[a-zA-Z0-9\s',]+$/, {
        message:
          "Only letters, numbers, spaces, commas, and apostrophes are allowed",
      }),
    state: z
      .string()
      .min(1, { message: "State is required" })
      .regex(/^[a-zA-Z0-9\s',]+$/, {
        message:
          "Only letters, numbers, spaces, commas, and apostrophes are allowed",
      }),
    zipcode: z
      .string()
      .regex(/^(\d{4}|\d{6})$/, { message: "Must be valid Pin Code" }),
    country: z
      .string()
      .min(1, { message: "Country is required" })
      .regex(/^[a-zA-Z0-9\s',]+$/, {
        message:
          "Only letters, numbers, spaces, commas, and apostrophes are allowed",
      }),
  });

export type CheckoutSchema = z.infer<typeof checkoutSchema>;
