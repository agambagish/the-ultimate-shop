import { z } from "zod";

export const checkoutWebhookSchema = z.object({
  mihpayid: z.string(),
  key: z.string(),
  txnid: z.string(),
  amount: z.string(),
  productinfo: z.string(),
  firstname: z.string(),
  lastname: z.string(),
  address1: z.string(),
  address2: z.string(),
  city: z.string(),
  state: z.string(),
  zipcode: z.string(),
  country: z.string(),
  email: z.string(),
  field1: z.string(),
  pa_name: z.string(),
  udf1: z.string(),
  udf2: z.string(),
  udf3: z.string(),
  udf4: z.string(),
  udf5: z.string(),
  status: z.string(),
  hash: z.string(),
});

export type CheckoutWebhookSchema = z.infer<typeof checkoutWebhookSchema>;
