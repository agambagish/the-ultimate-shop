import type { CheckoutSchema } from "@/features/cart/lib/checkout-schema";

export interface Step {
  title: string;
  description: string;
  fields: (keyof CheckoutSchema)[];
}
