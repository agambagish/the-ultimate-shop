import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

import { products } from "@/db/schema";
import { MAX_IMAGE_SIZE } from "@/lib/constants";

export const createProductSchema = createInsertSchema(products, {
  title: (s) => s.min(3, { message: "At least 3 characters required" }),
  slug: (s) => s.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).min(5),
  description: (s) => s.min(7, { message: "At least 7 characters required" }),
  longDescription: (s) =>
    s.min(12, { message: "At least 12 characters required" }),
  price: (s) =>
    s.regex(/^\d+(\.\d{1,2})?$/, { message: "Must be valid price" }),
  discountPercentage: (s) =>
    s.gte(0, { message: "Must be greater than or equeal to 0" }),
})
  .omit({
    thumbnailImageURL: true,
    imageURL1: true,
    imageURL2: true,
    imageURL3: true,
    imageURL4: true,
    imageURL5: true,
    fileTypes: true,
    rating: true,
    productAssetId: true,
    storeId: true,
    updatedAt: true,
  })
  .extend({
    thumbnailImage: z
      .array(z.custom<File>())
      .min(1, "Please select at least 1 file")
      .max(1, "You can select only 1 file")
      .refine((files) => files.every((file) => file.size <= MAX_IMAGE_SIZE), {
        message: "File size must be less than 5MB",
        path: ["thumbnailImage"],
      }),
    image1: z
      .array(z.custom<File>())
      .min(1, "Please select at least 1 file")
      .max(1, "You can select only 1 file")
      .refine((files) => files.every((file) => file.size <= MAX_IMAGE_SIZE), {
        message: "File size must be less than 5MB",
        path: ["image1"],
      }),
    image2: z
      .array(z.custom<File>())
      .min(1, "Please select at least 1 file")
      .max(1, "You can select only 1 file")
      .refine((files) => files.every((file) => file.size <= MAX_IMAGE_SIZE), {
        message: "File size must be less than 5MB",
        path: ["image2"],
      }),
    image3: z
      .array(z.custom<File>())
      .max(1, "You can select only 1 file")
      .refine((files) => files.every((file) => file.size <= MAX_IMAGE_SIZE), {
        message: "File size must be less than 5MB",
        path: ["image3"],
      }),
    image4: z
      .array(z.custom<File>())
      .max(1, "You can select only 1 file")
      .refine((files) => files.every((file) => file.size <= MAX_IMAGE_SIZE), {
        message: "File size must be less than 5MB",
        path: ["image4"],
      }),
    image5: z
      .array(z.custom<File>())
      .max(1, "You can select only 1 file")
      .refine((files) => files.every((file) => file.size <= MAX_IMAGE_SIZE), {
        message: "File size must be less than 5MB",
        path: ["image5"],
      }),
    productAsset: z
      .array(z.custom<File>())
      .min(1, "Please select at least 1 file")
      .max(1, "You can select only 1 file")
      .refine((files) => files.every((file) => file.size <= 30 * 1024 * 1024), {
        message: "File size must be less than 30MB",
        path: ["productAsset"],
      }),
  });

export type CreateProductSchema = z.infer<typeof createProductSchema>;
