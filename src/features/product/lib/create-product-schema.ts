import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

import { products } from "@/db/schema";

export const createProductSchema = createInsertSchema(products, {
  title: (f) => f.min(3, { message: "Title must be at least 3 characters" }),
  description: (f) =>
    f.min(10, { message: "Description must be at least 10 characters" }),
  price: (f) =>
    f.regex(/^\d+(\.\d{1,2})?$/, {
      message: "Must be a valid price",
    }),
  inventory: (f) =>
    f.nonnegative({ message: "Inventory must be greater than equal to 0" }),
  status: (f) => f.default("draft"),
})
  .omit({
    images: true,
    storeId: true,
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    images: z
      .array(z.instanceof(File))
      .length(4, { message: "Must be 4 images" }),
  });

export type CreateProductSchema = z.infer<typeof createProductSchema>;
