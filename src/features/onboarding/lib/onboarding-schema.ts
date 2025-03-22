import { createInsertSchema } from "drizzle-zod";
import type { z } from "zod";

import { stores } from "@/db/schema";

export const onboardingSchema = createInsertSchema(stores, {
  businessName: (f) =>
    f
      .min(3, { message: "Business name must be at least 3 characters" })
      .max(24, { message: "Business name must be within 24 characters" }),
  businessDescription: (f) =>
    f.min(10, {
      message: "Business description must be at least 10 characters",
    }),
  firstName: (f) =>
    f.min(2, { message: "First name must be at least 2 characters" }),
  lastName: (f) =>
    f.min(2, { message: "Last name must be at least 2 characters" }),
  storeName: (f) =>
    f.min(2, { message: "Store name must be at least 2 characters" }),
  storeUrl: (f) =>
    f
      .min(2, { message: "Store URL must be at least 2 characters" })
      .regex(/^[a-z0-9-]+$/, {
        message: "URL can only contain lowercase letters, numbers, and hyphens",
      }),
  storeDescription: (f) =>
    f.min(10, { message: "Store description must be at least 10 characters" }),
  taxId: (f) =>
    f
      .min(5, { message: "Tax ID must be at least 5 characters" })
      .max(15, { message: "Tax ID must be within 15 characters" }),
  address: (f) =>
    f.min(5, { message: "Address must be at least 5 characters" }),
  country: (f) => f.min(1, { message: "Country can't be empty" }),
  state: (f) => f.min(1, { message: "State can't be empty" }),
  city: (f) => f.min(2, { message: "City must be at least 2 characters" }),
  zipCode: (f) =>
    f.min(5, { message: "Zip code must be at least 5 characters" }),
}).omit({
  email: true,
  status: true,
});

export type OnboardingSchema = z.infer<typeof onboardingSchema>;
