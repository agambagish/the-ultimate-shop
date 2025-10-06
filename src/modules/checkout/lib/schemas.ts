import z from "zod";

export const cardSchema = z.object({
  cardNumber: z
    .string()
    .min(1, "Card number is required")
    .regex(/^\d{16}$/, "Card number must be exactly 16 digits")
    .transform((val) => val.replace(/\s/g, "")),
  expiryDate: z
    .string()
    .min(1, "Expiry date is required")
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Expiry date must be in MM/YY format"),
  cvv: z
    .string()
    .min(1, "CVV is required")
    .regex(/^\d{3,4}$/, "CVV must be 3 or 4 digits"),
});

export const upiSchema = z.object({
  vpa: z
    .string()
    .min(1, "VPA is required")
    .regex(
      /^[a-z0-9._-]+@[a-z0-9.-]+$/,
      "Please enter a valid VPA (e.g., user@paytm)",
    ),
});

export type CardSchema = z.infer<typeof cardSchema>;
export type UPISchema = z.infer<typeof upiSchema>;
