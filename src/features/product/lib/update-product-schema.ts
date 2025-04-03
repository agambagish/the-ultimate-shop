import { createUpdateSchema } from "drizzle-zod";
import { z } from "zod";

import { products } from "@/db/schema";

export const updateProductSchema = createUpdateSchema(products)
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

export type UpdateProductSchema = z.infer<typeof updateProductSchema>;
