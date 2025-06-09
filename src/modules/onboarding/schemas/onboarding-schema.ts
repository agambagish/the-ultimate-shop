import { createInsertSchema } from "drizzle-zod";
import type { z } from "zod/v4";

import { stores } from "@/db/schema";

export const onboardingSchema = createInsertSchema(stores, {
  name: (s) => s.min(5),
  description: (s) => s.min(12),
  slug: (s) => s.regex(/^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$/).min(5),
  addressLine1: (s) => s.min(7),
  addressLine2: (s) => s.min(3).optional(),
  city: (s) => s.min(2),
  state: (s) => s.min(2),
  country: (s) => s.min(2),
  pinCode: (s) => s.min(2),
}).omit({
  avatarUrl: true,
  credits: true,
  rating: true,
  status: true,
  userId: true,
});

export type OnboardingSchema = z.infer<typeof onboardingSchema>;
