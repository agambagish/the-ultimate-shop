import { createInsertSchema } from "drizzle-zod";
import type { z } from "zod/v4";

import { products } from "@/db/schema";

export const createProductSchema = createInsertSchema(products, {
  title: (s) => s.min(3),
  description: (s) => s.min(7),
  longDescription: (s) => s.min(12),
  price: (s) => s.regex(/^\d+(\.\d{1,2})?$/),
  discountPercentage: (s) => s.gte(0),
}).omit({
  imageUrl: true,
  fileTypes: true,
  rating: true,
  storeId: true,
  updatedAt: true,
});

export type CreateProductSchema = z.infer<typeof createProductSchema>;
