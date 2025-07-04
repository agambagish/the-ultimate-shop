import { z } from "zod/v4";

export const hashParamSchema = z.object({
  key: z.string().min(1).max(6),
  txnid: z
    .string()
    .regex(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    ),
  productinfo: z.string(),
  amount: z.number().gte(0),
  email: z.email(),
  firstname: z.string().min(1),
  lastname: z.string().min(1).optional(),
  surl: z.url(),
  furl: z.url(),
  phone: z.number(),
  udf1: z.string().optional().default(""),
  udf2: z.string().optional().default(""),
  udf3: z.string().optional().default(""),
  udf4: z.string().optional().default(""),
  udf5: z.string().optional().default(""),
});

export type HashParamSchema = z.input<typeof hashParamSchema>;
